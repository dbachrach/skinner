define (["underscore", "class", "src/skinner/core/loader"], function (_, Class, loader) {
    "use strict";

    var Question = Class.extend({
        init: function (data, id, testData, style) {
            this.data = data;
            this.id = id;
            this.testData = testData;
            this.style = style;
            this.caseSensitiveScoring = this.testData["case sensitive scoring"] || false;
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
            var selectedAnswer = this.selectedAnswer().toString();
            var correctAnswer = this.correctAnswer().toString();
            if (!this.caseSensitiveScoring) {
                selectedAnswer = selectedAnswer.toLowerCase();
                correctAnswer = correctAnswer.toLowerCase();
            }
            if (selectedAnswer === correctAnswer) {
                return 1;
            }
            else {
                return 0;
            }
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
