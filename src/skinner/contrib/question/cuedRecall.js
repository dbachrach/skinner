define(["lib/jquery", "lib/lodash", "lib/underscore.string", "src/skinner/core/question", "src/skinner/core/keypath"], function($, _, _s, Question, keyPath) {
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
            $("#cuedRecallAnswer").focus();
        },

        selectedAnswer: function() {
            // Return the answer text box's value.
            return $("#cuedRecallAnswer").val();
        },

        reportResults: function (subject, pageId) {
            var reportSpellingDistance = keyPath(this.testData, "report.spelling distance", true);
            if (reportSpellingDistance) {
                var levenshtein = _s.levenshtein($("#cuedRecallAnswer").val(), this.correctAnswer());
                subject.report(pageId, this.id, "Spelling Distance", levenshtein);
            }
        }
    });

    return CuedRecallQuestion;
});
