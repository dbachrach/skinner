define (["lib/lodash", "lib/underscore.string", "lib/class", "src/skinner/core/loader", "src/skinner/core/keypath"], function (_, _s, Class, loader, keyPath) {
    "use strict";

    var Question = Class.extend({
        init: function (data, id, testData, style) {
            this.data = data;
            this.id = id;
            this.testData = testData;
            this.style = style;
            this.caseSensitiveScoring = keyPath(this.testData, "case sensitive scoring", false);

            var base = this;

            // Goes through the answers and finds the answer that ends with a *.
            // This answer is considered the correct answer.
            // We assign that answer to the _correctAnswer field.
            // We also remove the * from the answer for displaying in UI.
            this.data.answers = _.map(this.data.answers, function (answer) {
                if (_s.endsWith(answer, "*")) {
                    var trimmedAnswer = answer.substring(0, answer.length - 1);
                    base._correctAnswer = trimmedAnswer;
                    return trimmedAnswer;
                }
                else {
                    return answer;
                }
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
        correctAnswer: function () {
            return this._correctAnswer;
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
            var correctAnswer = this.correctAnswer();

            // Undefined selectedAnswer() indicates no selection, which is always incorrect.
            // Undefined correctAnswer() indicates "No correct answer", so is always incorrect.
            if (_.isUndefined(selectedAnswer) || _.isUndefined(correctAnswer)) {
                return false;
            }

            // All answers are transformed to strings for comparison.
            selectedAnswer = selectedAnswer.toString();
            correctAnswer = correctAnswer.toString();

            // "case sensative scoring" can be configured on the question.
            if (!this.caseSensitiveScoring) {
                selectedAnswer = selectedAnswer.toLowerCase();
                correctAnswer = correctAnswer.toLowerCase();
            }
            return (selectedAnswer === correctAnswer);
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
