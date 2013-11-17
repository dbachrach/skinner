define(["jquery", "underscore", "src/tri/core/subject", "src/tri/core/trial", "src/tri/core/tri"], function ($, _, Subject, Trial, tri) {
    "use strict";

    function Experiment(data) {
        this.data = data;
    }

    Experiment.prototype.begin = function () {
        var base = this;
        this.login(function (subjectNumber) {
            var dimensions = base.data.dimensions;
            var subject = new Subject(subjectNumber, dimensions);
            base.trial(subject);
        });
    };
    Experiment.prototype.login = function (callback) {
        var base = this;
        tri.loadModule(this.data.login.type, "login", function (Login) {
            var loginProcess = new Login(base.data.login);

            tri.loadLayout(base.data.login.type, "login", {}, "#main", function () {
                loginProcess.start(callback);
            });
        });
    }
    Experiment.prototype.trial = function (subject) {
        var trial = new Trial(this.data.steps, this.data.tasks, subject);
        trial.begin();
    }

    return Experiment;
});
