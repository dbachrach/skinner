define(["lib/jquery", "lib/lodash", "lib/class", "src/skinner/core/loader", "src/skinner/core/keypath", "src/skinner/core/task", "peg!src/skinner/core/parser/repeatStatement", "src/skinner/core/mode"], function ($, _, Class, loader, keyPath, Task, RepeatStatementParser, mode) {
    "use strict";

    var States = {
        PreTrial: 0,
        BeginStep: 1,
        ShowStep: 2,
        ShowRepeatedStep: 3,
        ShowInBetween: 4,
        RepeatedStepShown: 5,
        RepeatedStepShownAfterInBetween: 6,
        StepComplete: 7,
        Exit: 8
    };

    var Trial = Class.extend({
        init: function (data, subject) {
            this.steps = keyPath(data, "steps");
            this.tasks = keyPath(data, "tasks");
            this.subject = subject;
            this.dataCollection = keyPath(data, "data collection", {});

            var base = this;

            this.repeatData = _.map(this.steps, function (step) {
                return {
                    "repeatCount": base.repeatCountForStep(step),
                    "repeatIndex": 0
                };
            });

            this.state = States.PreTrial;
        },

        repeatCountForStep: function (step) {
            var repeatStatement = step.repeat;

            if (repeatStatement) {
                var repeatStructure = RepeatStatementParser.parse(repeatStatement);
                if (!_.isUndefined(repeatStructure.path)) {
                    return this.subject.conditionForPath(repeatStructure.path).length;
                }
                else if (!_.isUndefined(repeatStructure.times)) {
                    return repeatStructure.times;
                }
            }
            else {
                return 1;
            }
        },

        begin: function () {
            $(window).on("beforeunload", function () {
                return "Are you sure you want to leave? The experiment is not completed yet.";
            });


            var base = this;

            loader.loadLayoutInPackage("trial", "src/skinner/core/", {}, "#main", function () {
                $("#main").on("click", "#nextButton", function () {
                    base.currentStep.next();
                });

                base.nextState();
            });
        },

        /**
         * Ends the trial.
         */
        end: function (callback) {
            this._endCallback = callback;
            this.state = States.Exit;
            this.nextState();
        },

        complete: function () {
            var csv = this.subject.exportToCSV();

            var base = this;

            function onDone() {
                var delayLength = (mode.isTestMode()) ? 0 : 1000;
                _.delay(function () {
                    $(window).off("beforeunload");
                    base._endCallback();
                }, delayLength);
            }

            function onFailure(error) {
                base._endCallback(error);
            }

            console.log("---- COMPLETED CSV ----") /* RemoveLogging:skip */;
            console.log(csv) /* RemoveLogging:skip */;
            console.log("---- END CSV ----") /* RemoveLogging:skip */;


            if (keyPath(this.dataCollection, "type") === "upload to server") {
                var server = keyPath(this.dataCollection, "server");

                if (!_.isUndefined(server)) {
                    var uploadData = {
                        subject: this.subject.number,
                        data: csv
                    };
                    $.ajax({
                        type: "POST",
                        url: server,
                        processData: false,
                        contentType: "application/json",
                        data: JSON.stringify(uploadData),
                        success: function (response, text) {
                            onDone();
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            console.log("Failed to upload -- " + textStatus + " -- " + errorThrown);
                            onFailure(textStatus + " -- " + errorThrown);
                        }
                    });
                }
            }
            else {
                onDone();
            }
        },

        nextState: function () {
            var repeatData = this.repeatData[this.currentStepIndex];

            if (this.state === States.PreTrial) {
                this.state = States.BeginStep;
                this.currentStepIndex = 0;
                this.nextState();
            }
            else if (this.state === States.BeginStep) {
                if (repeatData.repeatCount === 1) {
                    this.state = States.ShowStep;
                    this.nextState();
                }
                else {
                    this.state = States.ShowRepeatedStep;
                    this.nextState();
                }
            }
            else if (this.state === States.ShowStep) {
                this.showStep();
                this.state = States.StepComplete;
            }
            else if (this.state === States.ShowRepeatedStep) {
                this.showStep(repeatData.repeatIndex);
                this.state = States.RepeatedStepShown;
            }
            else if (this.state === States.RepeatedStepShown) {
                repeatData.repeatIndex++;

                var inBetweenTask = keyPath(this.steps[this.currentStepIndex], "in between task");

                if (!_.isUndefined(inBetweenTask) && (repeatData.repeatIndex < repeatData.repeatCount)) {
                    this.state = States.ShowInBetween;
                    this.nextState();
                }
                else {
                    this.state = States.RepeatedStepShownAfterInBetween;
                    this.nextState();
                }
            }
            else if (this.state === States.RepeatedStepShownAfterInBetween) {
                if (repeatData.repeatIndex < repeatData.repeatCount) {
                    this.state = States.ShowRepeatedStep;
                    this.nextState();
                }
                else {
                    this.state = States.StepComplete;
                    this.nextState();
                }
            }
            else if (this.state === States.ShowInBetween) {
                this.showInBetweenTask(repeatData.repeatIndex);
                this.state = States.RepeatedStepShownAfterInBetween;
            }
            else if (this.state === States.StepComplete) {
                this.currentStepIndex++;

                if (this.steps.length <= this.currentStepIndex) {
                    // TODO: Throw error
                }
                else {
                    this.state = States.BeginStep;
                    this.nextState();
                }
            }
            else if (this.state === States.Exit) {
                this.complete();
            }
        },
        showStep: function (repeatIndex) {
            var stepData = this.steps[this.currentStepIndex];

            this.showTask(stepData.task, repeatIndex);
        },
        showInBetweenTask: function (repeatIndex) {
            var inBetweenTask = keyPath(this.steps[this.currentStepIndex], "in between task");

            this.showTask(inBetweenTask, repeatIndex);
        },

        showTask: function (taskName, repeatIndex) {
            var additionalDimensionData = {};
            var context;

            if (!_.isUndefined(repeatIndex)) {
                additionalDimensionData._index = repeatIndex + 1; // adding one to make it 1 based indexing
                context = repeatIndex;
            }

            var taskData = this.tasks[taskName];
            this.currentStep = new Task(taskName, this, taskData, this.subject, additionalDimensionData, context);
            this.currentStep.begin();
        },

        /**
         * Moves to the next step.
         */
        nextStep: function () {
            this.nextState();
        }
    });

    return Trial;
});
