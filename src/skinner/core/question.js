define (["underscore", "class", "src/skinner/core/loader"], function (_, Class, loader) {
    "use strict";

    var Question = Class.extend({
        init: function (data, id, testData, style) {
            this.data = data;
            this.id = id;
            this.testData = testData;
            this.style = style;
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
            if (this.selectedAnswer() === this.correctAnswer()) {
                return 1;
            }
            else {
                return 0;
            }
        },
        maxScore: function () {
            return 1;
        }
    });

    return Question;
});
