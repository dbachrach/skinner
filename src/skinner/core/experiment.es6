// `experiment` dependencies: subject, trial, loader

import Subject from './subject.js';
import Trial from './trial.js';
import Loader from './loader.js';

export default class Experiment {
  /**
   * ### Experiment()
   * An Experiment encompasses all information: data, steps, subject, dimensions, etc.
   * @param data The properties of the experiment. Typically read from an experiment.yaml file.
   */
  constructor(data) {
    super();
    this.data = data;
  }

  /**
   * ### Experiment.begin()
   * Begins the experiment.
   * First, logs in the subject. Then starts the trial.
   */
  begin() {
    this.startLogin(subjectNumber => {
      const subject = new Subject(subjectNumber, this.data.dimensions);
      this.startTrial(subject);
    });
  }

  /**
   * ### Experiment.startLogin()
   * Starts the login process.
   * Uses the experiment's `login` method to implement login and receive a subject number.
   * @param callback Function to invoke after login succeeds.
   * The `callback` is called with one argument: `(subjectNumber)`.
   */
  startLogin() {
    return Loader
      .loadModule(this.data.login.type, "login")
      .then(Login => {
        const loginProcess = new Login(this.data.login);

        return Loader
          .loadLayout(this.data.login.type, "login", {}, "#main")
          .then(() => {
            return loginProcess.start();
          });
      });
  },

  /**
   * ### Experiment.startTrial()
   * Starts the trial.
   * @param subject The subject of this experiment.
   */
  startTrial: function (subject) {
      var trial = new Trial(this.data, subject);
      trial.begin();
  }
}
