define(["lib/jquery", "lib/underscore", "src/skinner/core/question", "lib/levenshtein"], function($, _, Question, Levenshtein) {
    "use strict";

    function pathFind(obj, path, defaultValue) {
        var foundValue = _.reduce(path.split("."), function (o, val) {
            if (!_.isUndefined(o) && o.hasOwnProperty(val)) {
                return o[val];
            }
            else {
                return undefined;
            }
            return o[val];
        }, obj);

        if (_.isUndefined(foundValue)) {
            return defaultValue;
        }
        else {
            return foundValue;
        }
    }

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

        reportResults: function (subject, testId) {
            var reportSpellingDistance = pathFind(this.testData, "report.spelling distance", true);
            if (reportSpellingDistance) {
                var levenshtein = new Levenshtein($("#cuedRecallAnswer").val(), this.correctAnswer());
                subject.report(testId, this.id, "Spelling Distance", levenshtein.distance);
            }
        }
    });

    return CuedRecallQuestion;
});
