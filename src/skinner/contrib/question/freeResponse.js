define(["src/skinner/contrib/question/cuedRecall"], function(CuedRecallQuestion) {
    "use strict";

    var FreeResponseQuestion = CuedRecallQuestion.extend({

        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);
        },
    });

    return FreeResponseQuestion;
});
