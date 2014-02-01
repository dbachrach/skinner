define(function (require) {
    module("functional/multiple-choice-test", {
        setup: function () {
            F.open("../index.html?config=multiplechoicetest&questions=simpletest_questions&test=true");
        }
    });

    test("functional/multiple-choice-test", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");

        F("#test .default_question").text("What's your favorite city?");
        F("#test label[for='questionAnswer-1-0']").text("San Antonio, TX");
        F("#test label[for='questionAnswer-1-1']").text("Seattle, WA");
        F("#test label[for='questionAnswer-1-2']").text("Los Angeles, CA");
        F("#questionAnswer-1-0").click();
        F("#nextButton .content").html("Next").click();

        F("#test .default_question").text("What's your favorite color?");
        F("#test label[for='questionAnswer-2-0']").text("Red");
        F("#test label[for='questionAnswer-2-1']").text("Green");
        F("#test label[for='questionAnswer-2-2']").text("Purple");
        F("#questionAnswer-2-1").click();
        F("#nextButton .content").html("Next").click();

        F("#test .default_question").text("What's your favorite food?");
        F("#test label[for='questionAnswer-3-0']").text("Pizza");
        F("#test label[for='questionAnswer-3-1']").text("Ice Cream");
        F("#test label[for='questionAnswer-3-2']").text("Salad");
        F("#questionAnswer-3-2").click();
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
        F("#page").type("results");
        F("#resultData").visible().html('"page","id","subject","answer"<br>"A-test-multipleChoice-multipleChoiceTest","1","1","San Antonio, TX"<br>"A-test-multipleChoice-multipleChoiceTest","2","1","Green"<br>"A-test-multipleChoice-multipleChoiceTest","3","1","Salad"');
    });

    module("functional/multiple-choice-inline-test", {
        setup: function () {
            F.open("../index.html?config=multiplechoiceinlinetest&questions=simpletest_questions&test=true");
        }
    });

    test("functional/multiple-choice-inline-test", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");

        F("#test_question_1 .default_question").text("What's your favorite city?");
        F("#test_question_1 label[for='questionAnswer-1-0']").text("San Antonio, TX");
        F("#test_question_1 label[for='questionAnswer-1-1']").text("Seattle, WA");
        F("#test_question_1 label[for='questionAnswer-1-2']").text("Los Angeles, CA");
        F("#questionAnswer-1-0").click();

        F("#test_question_2 .default_question").text("What's your favorite color?");
        F("#test_question_2 label[for='questionAnswer-2-0']").text("Red");
        F("#test_question_2 label[for='questionAnswer-2-1']").text("Green");
        F("#test_question_2 label[for='questionAnswer-2-2']").text("Purple");
        F("#questionAnswer-2-1").click();

        F("#test_question_3 .default_question").text("What's your favorite food?");
        F("#test_question_3 label[for='questionAnswer-3-0']").text("Pizza");
        F("#test_question_3 label[for='questionAnswer-3-1']").text("Ice Cream");
        F("#test_question_3 label[for='questionAnswer-3-2']").text("Salad");
        F("#questionAnswer-3-2").click();
        
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
        F("#page").type("results");
        F("#resultData").visible().html('"page","id","subject","answer"<br>"A-test-multipleChoice-multipleChoiceTest","1","1","San Antonio, TX"<br>"A-test-multipleChoice-multipleChoiceTest","2","1","Green"<br>"A-test-multipleChoice-multipleChoiceTest","3","1","Salad"');

    });
});
