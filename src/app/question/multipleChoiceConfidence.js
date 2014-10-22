define(["lib/jquery", "src/skinner/core/question", "lib/Handlebars"], function ($, Question, Handlebars) {
    "use strict";

    var MultipleChoiceConfidenceQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);
            this.hasShownConfidence = false;

            // Create an `answerLabel` handlebars helper.
            // Takes the loop index (`@index`) and turns it into an answer label.
            // Example: `{{answerLabel 0 }}` -> `"A) "`.
            //          `{{answerLabel 2 }}` -> `"C) "`.
            Handlebars.registerHelper("answerLabel", function (index) {
                return String.fromCharCode(65 + index);
            });  
        },
        postShow: function () {
            $("#mc_confidence").hide();

            var base = this;
            $("#altNextButton").on("click", function () {
                if (!_.isUndefined(base.test)) {
                    base.test.next();
                }
            });
        },
        selectedAnswer: function () {
            // TODO: Can we not have to use this.where?
            return $(this.where + " input[name=questionAnswer-" + this.id + "]:checked").val();
        },
        reportResults: function (subject, pageId) {
            var confidence = $("#confidence-answer-" + this.id).val();
            subject.report(pageId, this.id, "MC Confidence", confidence);
        },
        moveOn: function () {
            if (!this.hasShownConfidence) {
                this.hasShownConfidence = true;

                $("#mc_confidence").show();

                var allInputs = $(".mc_fields input");
                allInputs.prop("disabled", true);
                allInputs.addClass("disabled");
                // TODO: Fully disable radio buttons

                return false;
            }
            else {
                return true;
            }
        }
    });

    return MultipleChoiceConfidenceQuestion;
});
