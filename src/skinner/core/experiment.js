// `experiment` dependencies: subject, trial, skinner
define(["src/skinner/core/subject", "src/skinner/core/trial", "src/skinner/core/skinner"], function (Subject, Trial, skinner) {
    "use strict";

    // ## Experiment

    /** 
     * ### Experiment()
     * An Experiment encompasses all information: data, steps, subject, dimensions, etc.
     * @param data The properties of the experiment. Typically read from an experiment.yaml file.
     */
    function Experiment(data) {
        this.data = data;
    }

    /**
     * ### Experiment.begin()
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
     * ### Experiment.startLogin()
     * Starts the login process.
     * Uses the experiment's `login` method to implement login and receive a subject number.
     * @param callback Function to invoke after login succeeds.
     * The `callback` is called with one argument: `(subjectNumber)`.
     */
    Experiment.prototype.startLogin = function (callback) {
        var base = this;
        skinner.loadModule(this.data.login.type, "login", function (Login) {
            var loginProcess = new Login(base.data.login);

            skinner.loadLayout(base.data.login.type, "login", {}, "#main", function () {
                loginProcess.start(callback);
            });
        });
    }

    /**
     * ### Experiment.startTrial()
     * Starts the trial.
     * @param subject The subject of this experiment.
     */
    Experiment.prototype.startTrial = function (subject) {
        var trial = new Trial(this.data.steps, this.data.tasks, subject);
        trial.begin();
    }

    // Export the `Experiment` module.
    return Experiment;
});
