define(["jquery", "underscore", "tri/core/trial", "tri/core/subject"], function ($, _, Trial, Subject) {
    "use strict";

    function Experiment(data) {
        this.data = data;
    }

    Experiment.prototype.begin = function () {
        var _this = this;
        this.login(function () {
            _this.trial();
        });
    };
    Experiment.prototype.login = function (callback) {
        // TODO: Look for login type
        var _this = this;
        $("#main").load("layouts/login.html", function () {
            $("#loginButton").click(function () {
                _this.subject = new Subject($("#subjectNumber").val());
                if (_.isFunction(callback)) callback();
            });
        });
    }
    Experiment.prototype.trial = function () {
        var trial = new Trial(this.data.pages, this.subject);
        trial.begin();
    }

    return Experiment;
});
