define(["jquery", "underscore", "src/skinner/core/skinner", "src/skinner/core/task", "src/skinner/core/helpers"], function ($, _, skinner, Task, helpers) {
    "use strict";

    function Trial(steps, tasks, subject) {
        this.steps = steps;
        this.tasks = tasks;
        this.subject = subject;
    }

    Trial.prototype.begin = function () {
        var base = this;

        skinner.loadLayoutInPackage("trial", "src/skinner/core/", {}, "#main", function () {
            $("#main").on("click", "#prevButton", function () {
                base.currentStep.previous();
            });

            $("#main").on("click", "#nextButton", function () {
                base.currentStep.next();
            });

            base.currentStepIndex = 0;
            base.showStep();
        });
    };
    Trial.prototype.showStep = function () {
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
            var repeatWith = step["repeat"]; // todo; Use dot syntax
            console.log("repeat with " + repeatWith);
            if (repeatWith) {
                return helpers.readDimension(repeatWith, base.subject).length;
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
        };

        console.log("got step index of " + stepIndex);
        if (stepIndex == -1) {
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
        var context = undefined

        if (repeatIndex != -1) {
            additionalDimensionData["%%index"] = repeatIndex + 1; // adding one to make it 1 based indexing
            // additionalDimensionData["%num"] = helpers.readDimension(stepData["repeat"], this.subject)[repeatIndex]; // TODO: Do this based on repeat index
            context = { "index" : repeatIndex };
        }
        // console.log("additional dims");
        // console.log(additionalDimensionData);
        var taskData = this.tasks[stepData.task];
        console.log("Created context: ");console.log(context);
        this.currentStep = new Task(this, taskData, this.subject, additionalDimensionData, context);
        this.currentStep.begin();
    };

    /**
     * Moves to the previous step.
     */
    Trial.prototype.previousStep = function () {
        this.currentStepIndex--;
        this.showStep();
    }

    /**
     * Moves to the next step.
     */
    Trial.prototype.nextStep = function () {
        this.currentStepIndex++;
        this.showStep();
    }

    /**
     * Ends the trial.
     */
    Trial.prototype.end = function () {
        console.log("End trial");
        this.subject.export();
    };

    return Trial;
});
