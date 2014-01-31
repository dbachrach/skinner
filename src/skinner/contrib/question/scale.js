define(["lib/jquery", "src/skinner/core/question", "src/skinner/core/keypath", "peg!src/skinner/contrib/parser/scaleStatement"], function ($, Question, keyPath, ScaleStatementParser) {
    "use strict";

    var ScaleQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);

            var scaleStatement = keyPath(this.data, "scale");

            if (_.isString(scaleStatement)) {
                var scaleStructure = ScaleStatementParser.parse(scaleStatement);

                var low = scaleStructure.low.value;
                var high = scaleStructure.high.value;
                this.scales = _.map(_.range(low, high + 1), function (val) {
                    var subtitle;
                    if (val === low) {
                        subtitle = scaleStructure.low.subtitle;
                    }
                    else if (val === high) {
                        subtitle = scaleStructure.high.subtitle;
                    }
                    return { value: val, subtitle: subtitle };
                });
            }
            else if (_.isArray(scaleStatement)) {
                this.scales = _.map(scaleStatement, function (scaleElement, index) {
                    var parsedScale = ScaleStatementParser.parse(scaleElement);
                    if (_.isString(parsedScale)) {
                        return { value: (index + 1), subtitle: parsedScale };
                    }
                    else {
                        return parsedScale;
                    }
                });
            }
        },
        selectedAnswer: function () {
            return $("input[name=questionAnswer-" + this.id + "]:checked").val();
        },
        extendedBindContent: function () {
            return { scales: this.scales };
        },
        reportGroupedResults: function (subject, testId) {
            _.each(this.data.questions, function (q) {
                var answer = $("input[name=questionAnswer-" + q.id + "]:checked").val();
                subject.report(testId, q.id, "answer", answer);
            });
        }
    });

    return ScaleQuestion;
});
