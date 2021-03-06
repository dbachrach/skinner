define(["lib/jquery", "lib/lodash", "lib/underscore.string", "src/skinner/core/question", "src/skinner/core/keypath"], function ($, _, _s, Question, keyPath) {
    "use strict";

    // ## CuedRecallQuestion
    // A CuedRecallQuestion is a fill-in-the-blank style question.
    // It displays a question and a text box allowing the subject to enter a free response answer.

    var CuedRecallQuestion = Question.extend({

        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);
        },

        postShow: function () {
            // After loading the page, put the cursor focus on the answer text box.

            // TODO: It's ugly that the question has to use keypath about the testdata
            if (!keyPath(this.testData, "inline", false)) {
                $("#answer-" + this.id).focus();
            }
        },

        selectedAnswer: function () {
            // Return the answer text box's value.
            return $("#answer-" + this.id).val();
        },

        reportResults: function (subject, pageId) {
            var reportSpellingDistance = keyPath(this.testData, "report.spelling distance", true);
            if (reportSpellingDistance && !_.isEmpty(this.correctAnswers())) {
                // TODO: Iterate over all correct answers, and return the lowest distance
                var levenshtein = _s.levenshtein($("#answer-"  + this.id).val(), this.correctAnswers()[0]);
                subject.report(pageId, this.id, "Spelling Distance", levenshtein);
            }
        }
    });

    return CuedRecallQuestion;
});
