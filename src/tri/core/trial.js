define(["jquery", "underscore", "src/tri/core/tri", "src/tri/core/task", "src/tri/core/helpers"], function ($, _, tri, Task, helpers) {
    "use strict";

    function Trial(steps, tasks, subject) {
        this.steps = steps;
        this.tasks = tasks;
        this.subject = subject;
    }

    Trial.prototype.begin = function () {
        var base = this;

        tri.loadLayoutInPackage("trial", "src/tri/core/", {}, "#main", function () {
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
    Trial.prototype.previousStep = function () {
        this.currentStepIndex--;
        this.showStep();
    }
    Trial.prototype.nextStep = function () {
        console.log("Trial.nextStep()");
        this.currentStepIndex++;
        this.showStep();
    }
    Trial.prototype.end = function () {
        console.log("End trial");
    };

    return Trial;
});
