define(["lib/jquery", "src/skinner/core/question", "lib/Handlebars"], function ($, Question, Handlebars) {
    "use strict";

    var MultipleChoiceQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);

            // Create an `answerLabel` handlebars helper.
            // Takes the loop index (`@index`) and turns it into an answer label.
            // Example: `{{answerLabel 0 }}` -> `"A) "`.
            //          `{{answerLabel 2 }}` -> `"C) "`.
            Handlebars.registerHelper("answerLabel", function (index) {
                return String.fromCharCode(65 + index);
            });
        },
        selectedAnswer: function () {
            // TODO: Can we not have to use this.where?
            return $(this.where + " input[name=questionAnswer-" + this.id + "]:checked").val();
        },
        disable: function () {
            $("input[name='questionAnswer-" + this.id + "']").attr("disabled", true);
        }
    });

    return MultipleChoiceQuestion;
});
