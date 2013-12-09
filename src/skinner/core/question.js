define (["lib/lodash", "lib/class", "src/skinner/core/loader", "src/skinner/core/keypath"], function (_, Class, loader, keypath) {
    "use strict";

    var Question = Class.extend({
        init: function (data, id, testData, style) {
            this.data = data;
            this.id = id;
            this.testData = testData;
            this.style = style;
            this.caseSensitiveScoring = keypath(this.testData, "case sensitive scoring", false);
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
            return this.data.correctAnswer;
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

            // Undefined selectedAnswer() indicates no selection, which is always incorrect.
            if (_.isUndefined(selectedAnswer)) {
                return false;
            }

            // All answers are transformed to strings for comparison.
            selectedAnswer = selectedAnswer.toString();
            var correctAnswer = this.correctAnswer().toString();

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
