// `experiment` dependencies: subject, trial, loader
define(["class", "src/skinner/core/subject", "src/skinner/core/trial", "src/skinner/core/loader"], function (Class, Subject, Trial, loader) {
    "use strict";

    // ## Experiment
    var Experiment = Class.extend({

        /** 
         * ### Experiment()
         * An Experiment encompasses all information: data, steps, subject, dimensions, etc.
         * @param data The properties of the experiment. Typically read from an experiment.yaml file.
         */
        init: function (data) {
            this.data = data;
        },

        /**
         * ### Experiment.begin()
         * Begins the experiment.
         * First, logs in the subject. Then starts the trial.
         */
        begin: function () {
            var base = this;
            this.startLogin(function (subjectNumber) {
                var subject = new Subject(subjectNumber, base.data.dimensions);
                base.startTrial(subject);
            });
        },

        /**
         * ### Experiment.startLogin()
         * Starts the login process.
         * Uses the experiment's `login` method to implement login and receive a subject number.
         * @param callback Function to invoke after login succeeds.
         * The `callback` is called with one argument: `(subjectNumber)`.
         */
        startLogin: function (callback) {
            var base = this;
            loader.loadModule(this.data.login.type, "login", function (Login) {
                var loginProcess = new Login(base.data.login);

                loader.loadLayout(base.data.login.type, "login", {}, "#main", function () {
                    loginProcess.start(callback);
                });
            });
        },

        /**
         * ### Experiment.startTrial()
         * Starts the trial.
         * @param subject The subject of this experiment.
         */
        startTrial: function (subject) {
            var trial = new Trial(this.data.steps, this.data.tasks, subject);
            trial.begin();
        }
    });

    // Export the `Experiment` module.
    return Experiment;
});
