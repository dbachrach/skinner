define(function (require) {

    // Tests that a dimension's value will be expanded for the current subject's condition.

    module("functional/dimensions", {
        setup: function () {
            F.open("../index.html?config=dimensions&test=true");
        }
    });

    test("functional/dimensions - Subject 1", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test John");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });

    test("functional/dimensions - Subject 2", function () {
        expect(0);
        F("#subjectNumber").type("2");
        F("#loginButton").visible().click();
        F("#page h2").text("Test Jack");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });
});
