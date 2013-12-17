define(["lib/jquery", "lib/lodash", "lib/class", "src/skinner/core/loader", "src/skinner/core/task", "peg!src/skinner/core/parser/repeatStatement"], function ($, _, Class, loader, Task, RepeatStatementParser) {
    "use strict";

    var Trial = Class.extend({
        init: function (steps, tasks, subject) {
            this.steps = steps;
            this.tasks = tasks;
            this.subject = subject;
        },

        begin: function () {
            var base = this;

            loader.loadLayoutInPackage("trial", "src/skinner/core/", {}, "#main", function () {
                $("#main").on("click", "#prevButton", function () {
                    base.currentStep.previous();
                });

                $("#main").on("click", "#nextButton", function () {
                    base.currentStep.next();
                });

                base.currentStepIndex = 0;
                base.showStep();
            });
        },
        showStep: function () {
            console.log("Show step: " + (this.currentStepIndex + 1) + " of " + this.steps.length);

            var base = this;
            // var totatlStepCount = _.reduce(this.steps, function (memo, stepData) {
            //     var repeatWith = stepData["repeat-with"];
            //     console.log("repeat with " + repeatWith);
            //     if (repeatWith) {
            //         return memo + helpers.dimensionSize(repeatWith, base.subject);
            //     }
            //     else {
            //         return memo + 1;
            //     }
            // }, 0);

            var stepSizes = _.map(this.steps, function (step) {
                var repeatStatement = step.repeat;

                if (repeatStatement) {
                    var repeatStructure = RepeatStatementParser.parse(repeatStatement);
                    if (!_.isUndefined(repeatStructure.path)) {
                        return base.subject.conditionForPath(repeatStructure.path).length;
                    }
                    else if (!_.isUndefined(repeatStructure.times)) {
                        return repeatStructure.times;
                    }
                }
                else {
                    return 1;
                }
            });
            console.log("stepsizes:"); console.log(stepSizes);

            var stepIndex = -1;
            var repeatIndex = -1;
            var accl = 0;
            for (var i = 0; i < stepSizes.length; i++) {
                if (this.currentStepIndex + 1 <= accl + stepSizes[i]) {
                    stepIndex = i;
                    if (stepSizes[i] > 1) {
                        repeatIndex = (this.currentStepIndex) - (accl);
                    }
                    break;
                }
                accl = accl + stepSizes[i];
            }

            console.log("got step index of " + stepIndex);
            if (stepIndex === -1) {
                return this.end();
            }

            console.log("Step index " + stepIndex + " repeat index " + repeatIndex);

            // console.log("Total step count: " + totatlStepCount);
            // if (totatlStepCount <= this.currentStepIndex) {
            //     return this.end();
            // }
            // TODO: Handle back button reloads a new page rather than using the old one

            var stepData = this.steps[stepIndex];
            console.log(stepData);

            var additionalDimensionData = {};
            var context;

            if (repeatIndex !== -1) {
                additionalDimensionData._index = repeatIndex + 1; // adding one to make it 1 based indexing
                context = repeatIndex;
            }
            // console.log("additional dims");
            // console.log(additionalDimensionData);
            var taskData = this.tasks[stepData.task];
            console.log("Created context: ");console.log(context);
            this.currentStep = new Task(stepData.task, this, taskData, this.subject, additionalDimensionData, context);
            this.currentStep.begin();
        },

        /**
         * Moves to the previous step.
         */
        previousStep: function () {
            this.currentStepIndex--;
            this.showStep();
        },

        /**
         * Moves to the next step.
         */
        nextStep: function () {
            this.currentStepIndex++;
            this.showStep();
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
