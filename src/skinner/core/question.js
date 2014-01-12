define (["lib/lodash", "lib/underscore.string", "lib/class", "src/skinner/core/loader", "src/skinner/core/keypath"], function (_, _s, Class, loader, keyPath) {
    "use strict";

    var Question = Class.extend({
        init: function (data, id, testData, style) {
            this.data = data;
            if (_.isUndefined(this.data)) {
                this.data = {};
            }

            this.id = id;
            this.testData = testData;
            this.style = style;
            this.caseSensitiveScoring = keyPath(this.testData, "case sensitive scoring", false);

            this.data.answers = keyPath(this.data, "answers", []);


            var base = this;

            var correctAnswerData = keyPath(this.data, "correct answer");
            var correctAnswersData = keyPath(this.data, "correct answers");
            if (!_.isUndefined(correctAnswerData)) {
                base._correctAnswers = [correctAnswerData];
            }
            else if (!_.isUndefined(correctAnswersData)) {
                base._correctAnswers = correctAnswersData;
            }
            else {
                // Goes through the answers and finds the answer that ends with a *.
                // This answer is considered the correct answer.
                // We assign that answer to the _correctAnswers field.
                // We also remove the * from the answer for displaying in UI.
                this.data.answers = _.map(this.data.answers, function (answer) {
                    // TODO: Support multiple * correct answers
                    if (_s.endsWith(answer, "*")) {
                        var trimmedAnswer = answer.substring(0, answer.length - 1);
                        base._correctAnswers = [trimmedAnswer];
                        return trimmedAnswer;
                    }
                    else {
                        return answer;
                    }
                });
            }

            // Trim white space from answers.
            // TODO: Write a test for this
            this.data.answers = _.map(this.data.answers, function (answer) {
                return _s.trim(answer);
            });

            base._correctAnswers = _.map(base._correctAnswers, function (answer) {
                return _s.trim(answer);
            });
        },
        show: function () {
            var base = this;

            this.preShow();

            loader.loadLayout(this.style, "question", _.extend({}, this.testData, { "data": this.data }), "#test", function () {
                base.postShow();
            });
        },
        preShow: function() {
            // Override
        },
        postShow: function() {
            // Override
        },
        selectedAnswer: function () {
            throw "Question did not override selectedAnswer()";
        },
        correctAnswers: function () {
            return this._correctAnswers;
        },
        tallyScore: function () {
            if (this.isCorrect()) {
                return 1;
            }
            else {
                return 0;
            }
        },
        isCorrect: function () {
            var selectedAnswer = this.selectedAnswer();
            var correctAnswers = this.correctAnswers();

            // Undefined selectedAnswer() indicates no selection, which is always incorrect.
            // Undefined correctAnswers() indicates "No correct answer", so is always incorrect.
            if (_.isUndefined(selectedAnswer) || _.isUndefined(correctAnswers)) {
                return false;
            }

            var base = this;

            return _.any(correctAnswers, function (correctAnswer) {
                // All answers are transformed to strings for comparison.
                selectedAnswer = selectedAnswer.toString();
                correctAnswer = correctAnswer.toString();

                // "case sensative scoring" can be configured on the question.
                if (!base.caseSensitiveScoring) {
                    selectedAnswer = selectedAnswer.toLowerCase();
                    correctAnswer = correctAnswer.toLowerCase();
                }
                return (selectedAnswer === correctAnswer);
            });
        },
        maxScore: function () {
            return 1;
        },
        reportResults: function (subject, testId) {
            // Override
        }
    });

    return Question;
});
