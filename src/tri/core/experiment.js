define(["src/tri/core/subject", "src/tri/core/trial", "src/tri/core/tri"], function (Subject, Trial, tri) {
    "use strict";

    /**
     * An Experiment encompasses all information: data, steps, subject, dimensions, etc.
     * @param data The properties of the experiment. Typically read from an experiment.yaml file.
     */
    function Experiment(data) {
        this.data = data;
    }

    /**
     * Begins the experiment.
     * First, logs in the subject. Then starts the trial.
     */
    Experiment.prototype.begin = function () {
        var base = this;
        this.startLogin(function (subjectNumber) {
            var subject = new Subject(subjectNumber, base.data.dimensions);
            base.startTrial(subject);
        });
    };

    /**
     * Starts the login process.
     * Uses the experiment's `login` method to implement login and receive a subject number.
     * @param callback Function to invoke after login succeeds.
     * The `callback` is called with one argument: `(subjectNumber)`.
     */
    Experiment.prototype.startLogin = function (callback) {
        var base = this;
        tri.loadModule(this.data.login.type, "login", function (Login) {
            var loginProcess = new Login(base.data.login);

            tri.loadLayout(base.data.login.type, "login", {}, "#main", function () {
                loginProcess.start(callback);
            });
        });
    }

    /**
     * Starts the trial.
     * @param subject The subject of this experiment.
     */
    Experiment.prototype.startTrial = function (subject) {
        var trial = new Trial(this.data.steps, this.data.tasks, subject);
        trial.begin();
    }

    return Experiment;
});
