define(function (require) {
    var Test = require("src/skinner/core/page/test");

    module("skinner/core/page/test");

    test("test - Defaults", function () {
        var t = new Test();
        ok(t);

        equal(t.style, "multipleChoice");
    });

    test("test - id()", function () {
        var mockTask = { id: function () { return "MyTask"; } };

        var testData = { "type": "test", "question set": "SampleQuestionSet"};
        var t = new Test(testData, mockTask);
        equal(t.id(), "MyTask-test-multipleChoice-SampleQuestionSet");

        testData = { "type": "test", "style": "MyStyle", "question set": "SampleQuestionSet"};
        t = new Test(testData, mockTask);
        equal(t.id(), "MyTask-test-MyStyle-SampleQuestionSet");
    });

    // test("test - scoring - default - right", function () {
    //     var t = new Test();

    //     var mockQuestionRight = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "a"
    //     };

    //     t.currentQuestion = mockQuestionRight;
    //     equal(t.calculateCurrentQuestionScore(), 1);
    // });
    // test("test - scoring - default - wrong", function () {
    //     var t = new Test();

    //     var mockQuestionWrong = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "b"
    //     };

    //     t.currentQuestion = mockQuestionWrong;
    //     equal(t.calculateCurrentQuestionScore(), 0);
    // });
    // test("test - scoring - custom", function () {
    //     var t = new Test();

    //     var mockQuestionCustom = {
    //         selectedAnswer: function () { return "a"; },
    //         correctAnswer: "a",
    //         tallyScore: function () { return 5; }
    //     };

    //     t.currentQuestion = mockQuestionCustom;
    //     equal(t.calculateCurrentQuestionScore(), 5);

    //     var mockQuestionCustom2 = {
    //         tallyScore: function () { return -10; }
    //     };

    //     t.currentQuestion = mockQuestionCustom2;
    //     equal(t.calculateCurrentQuestionScore(), -10);

    // });
});
