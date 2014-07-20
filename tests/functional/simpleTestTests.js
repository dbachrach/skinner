define(function (require) {
    module("functional/simple-test", {
        setup: function () {
            F.open("../index.html?config=simpletest&questions=simpletest_questions&test=true");
        }
    });

    test("functional/simple-test", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");

        F("#test .default_question").text("What's your name?");
        F("#test #answer-1").type("John");
        F("#nextButton .content").html("Next").click();

        F("#test .default_question").text("What's your age?");
        F("#test #answer-2").type("35");
        F("#nextButton .content").html("Next").click();

        F("#test .default_question").text("What's your gender?");
        F("#test #answer-3").type("Male");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
        F("#page").type("results");
        
        F("#resultData").visible().html('"page","id","subject","answer"<br>"A-test-cuedRecall-simpletest","1","1","John"<br>"A-test-cuedRecall-simpletest","2","1","35"<br>"A-test-cuedRecall-simpletest","3","1","Male"');
    });

    module("functional/simple-inline-test", {
        setup: function () {
            F.open("../index.html?config=simpleinlinetest&questions=simpletest_questions&test=true");
        }
    });

    test("functional/simple-inline-test", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");

        F("#test_question_1 .default_question").text("What's your name?");
        F("#test_question_1 #answer-1").type("John");

        F("#test_question_2 .default_question").text("What's your age?");
        F("#test_question_2 #answer-2").type("35");

        F("#test_question_3 .default_question").text("What's your gender?");
        F("#test_question_3 #answer-3").type("Male");

        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
        F("#page").type("results");
        F("#resultData").visible().html('"page","id","subject","answer"<br>"A-test-cuedRecall-simpletest","1","1","John"<br>"A-test-cuedRecall-simpletest","2","1","35"<br>"A-test-cuedRecall-simpletest","3","1","Male"');
    });
});
