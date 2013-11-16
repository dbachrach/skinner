define(["jquery", "underscore", "src/tri/core/tri", "src/tri/core/task"], function ($, _, tri, Task) {
    "use strict";

    function Trial(steps, tasks, subject) {
        this.steps = steps;
        this.tasks = tasks;
        this.subject = subject;

        console.log("Created trial with steps:");
        console.log(this.steps);
    }

    Trial.prototype.begin = function () {
        var base = this;

        tri.loadLayoutInPackage("trial", "src/tri/core/", {}, "#main", function () {
            $("#main").on("click", "#prevButton", function () {
                base.currentStep.previousPage();
            });

            $("#main").on("click", "#nextButton", function () {
                base.currentStep.nextPage();
            });

            base.currentStepIndex = 0;
            base.showStep();
        });
    };
    Trial.prototype.showStep = function () {
        console.log("Show step: " + (this.currentStepIndex + 1) + " of " + this.steps.length);

        if (this.steps.length <= this.currentStepIndex) {
            return this.end();
        }
        // TODO: Handle back button reloads a new page rather than using the old one
        var base = this;

        var stepData = this.steps[this.currentStepIndex];
        console.log("loading step data:");
        console.log(stepData);

        var taskData = this.tasks[stepData.task];
        console.log("loading task data:");
        console.log(taskData);
        this.currentStep = new Task(this, taskData, this.subject);
        this.currentStep.begin();
    };
    Trial.prototype.previousStep = function () {
        this.currentStepIndex--;
        this.showStep();
    }
    Trial.prototype.nextStep = function () {
        this.currentStepIndex++;
        this.showStep();
    }
    Trial.prototype.end = function () {
        console.log("End trial");
    };

    return Trial;
});
