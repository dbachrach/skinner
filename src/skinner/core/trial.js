define(["lib/jquery", "lib/lodash", "lib/class", "src/skinner/core/loader", "src/skinner/core/keypath", "src/skinner/core/task", "peg!src/skinner/core/parser/repeatStatement"], function ($, _, Class, loader, keyPath, Task, RepeatStatementParser) {
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
        init: function (steps, tasks, subject) {
            this.steps = steps;
            this.tasks = tasks;
            this.subject = subject;

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
            var base = this;

            loader.loadLayoutInPackage("trial", "src/skinner/core/", {}, "#main", function () {
                $("#main").on("click", "#nextButton", function () {
                    base.currentStep.next();
                });

                base.nextState();
            });
        },
        nextState: function () {
            var repeatData = this.repeatData[this.currentStepIndex];

            if (this.state === States.PreTrial) {
                if (this.steps.length > 0) {
                    this.state = States.BeginStep;
                    this.currentStepIndex = 0;
                    this.nextState();
                }
                else {
                    this.state = States.Exit;
                    this.nextState();
                }
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
                    this.state = States.Exit;
                    this.nextState();
                }
                else {
                    this.state = States.BeginStep;
                    this.nextState();
                }
            }
            else if (this.state === States.Exit) {
                this.end();
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
        },

        /**
         * Ends the trial.
         */
        end: function () {
            var csv = this.subject.exportToCSV();
            console.log(csv);
        }
    });

    return Trial;
});
