define(function (require) {
    var Test = require("src/skinner/core/page/test");

    QUnit.module("skinner/core/page/test");

    QUnit.test("test - Defaults", function () {
        var t = new Test();
        QUnit.ok(t);

        QUnit.equal(t.style, "multipleChoice");
    });

    // QUnit.test("test - scoring - default - right", function () {
    //     var t = new Test();

    //     var mockQuestionRight = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "a"
    //     };

    //     t.currentQuestion = mockQuestionRight;
    //     QUnit.equal(t.calculateCurrentQuestionScore(), 1);
    // });
    // QUnit.test("test - scoring - default - wrong", function () {
    //     var t = new Test();

    //     var mockQuestionWrong = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "b"
    //     };

    //     t.currentQuestion = mockQuestionWrong;
    //     QUnit.equal(t.calculateCurrentQuestionScore(), 0);
    // });
    // QUnit.test("test - scoring - custom", function () {
    //     var t = new Test();

    //     var mockQuestionCustom = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "a",
    //         tallyScore: function () { return 5; }
    //     };

    //     t.currentQuestion = mockQuestionCustom;
    //     QUnit.equal(t.calculateCurrentQuestionScore(), 5);

    //     var mockQuestionCustom2 = {
    //         tallyScore: function () { return -10; }
    //     };

    //     t.currentQuestion = mockQuestionCustom2;
    //     QUnit.equal(t.calculateCurrentQuestionScore(), -10);

    // });
});
