define(["lib/jquery", "src/skinner/core/question", "lib/Handlebars", "lib/mousetrap"], function ($, Question, Handlebars, Mousetrap) {
    "use strict";

    var YesNoQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);

            this.chosenAnswer = "";
        },
        preShow: function() {
            var base = this;
            Mousetrap.bind("y", function (e) {
                base.chosenAnswer = "Yes"
                base.page.next();
            });
            Mousetrap.bind("n", function (e) {
                base.chosenAnswer = "No"
                base.page.next();
            });
        },
        selectedAnswer: function () {
            Mousetrap.unbind("y");
            Mousetrap.unbind("n");
            return this.chosenAnswer;
        }
    });

    return YesNoQuestion;
});
