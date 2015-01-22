define(["lib/jquery", "src/skinner/contrib/question/multipleChoice", "lib/Handlebars", "src/skinner/core/intervals", "src/skinner/core/keypath"], function ($, MultipleChoiceQuestion, Handlebars, intervals, keyPath) {
    "use strict";

    var MultipleChoiceSequenceQuestion = MultipleChoiceQuestion.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);

            this.sequentialAnswerTime = intervals.parseTimeInterval(keyPath(this.testData, "sequential answer time"));
            this.sequentialInitialDelay = intervals.parseTimeInterval(keyPath(this.testData, "sequential answer initial delay"));
        },
        postShow: function () {
            var base = this;
            function showAllAnswers() {
                $("#question_descriptions").hide();
                $(".mc_fields").show();
                // _.each(base.data.answers, function (value, answerIndex) {
                //     $("#questionAnswer-" + base.data.id + "-" + answerIndex + "-container").show();
                // });
            }

            function showAnswer(i) {
                $("#question_descriptions").show();
                
                _.each(base.data.answers, function (value, answerIndex) {
                    $("#descr_questionAnswer-" + base.data.id + "-" + answerIndex + "").hide();
                });
                $("#descr_questionAnswer-" + base.data.id + "-" + i + "").show();

                var delayTime = base.sequentialAnswerTime;
                if (i + 1 < base.data.answers.length) {
                    _.delay(showAnswer, delayTime, i + 1);
                }
                else {
                    _.delay(showAllAnswers, delayTime);
                }
            }
            $("#question_descriptions").hide();
            $(".mc_fields").hide();

            _.delay(showAnswer, this.sequentialInitialDelay, 0);
        },
        // selectedAnswer: function () {
        //     // TODO: Can we not have to use this.where?
        //     return $(this.where + " input[name=questionAnswer-" + this.id + "]:checked").val();
        // },
        // reportResults: function (subject, pageId) {
        //     var confidence = $("#confidence-answer-" + this.id).val();
        //     subject.report(pageId, this.id, "MC Confidence", confidence);
        // },
        // moveOn: function () {
        //     if (!this.hasShownConfidence) {
        //         this.hasShownConfidence = true;

        //         $("#mc_confidence").show();

        //         var allInputs = $(".mc_fields input");
        //         allInputs.prop("disabled", true);
        //         allInputs.addClass("disabled");
        //         // TODO: Fully disable radio buttons

        //         return false;
        //     }
        //     else {
        //         return true;
        //     }
        // }
    });

    return MultipleChoiceSequenceQuestion;
});
