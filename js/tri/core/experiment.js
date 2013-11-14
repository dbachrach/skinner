define(["jquery", "underscore", "tri/core/trial", "tri/core/tri"], function ($, _, Trial, tri) {
    "use strict";

    function Experiment(data) {
        this.data = data;
    }

    Experiment.prototype.begin = function () {
        var base = this;
        this.login(function (subject) {
            base.subject = subject;
            base.trial();
        });
    };
    Experiment.prototype.login = function (callback) {
        var base = this;
        tri.loadModule(this.data.login.type, "login", function (Login) {
            var loginProcess = new Login(this.data.login);
            loginProcess.start(callback);
        });
    }
    Experiment.prototype.trial = function () {
        var trial = new Trial(this.data.pages, this.subject);
        trial.begin();
    }

    return Experiment;
});
