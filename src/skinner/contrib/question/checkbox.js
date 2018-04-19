define(["lib/jquery", "src/skinner/core/question", "src/skinner/core/keypath"], function ($, Question, keyPath) {
    "use strict";

    var CheckboxQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);
        },
        selectedAnswer: function () {
            return String($("input[name=questionAnswer-" + this.id + "]").is(":checked"));
        },
        reportGroupedResults: function (subject, testId) {
            _.each(this.data.questions, function (q) {
                var answer = String($("input[name=questionAnswer-" + q.id + "]").is(":checked")) + ':' + q.question;
                subject.report(testId, q.id, "answer", answer);
            });
        }
    });

    return CheckboxQuestion;
});
