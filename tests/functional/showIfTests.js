define(function (require) {

    // Tests that the show if statement works

    module("functional/showif", {
        setup: function () {
            F.open("../index.html?config=showif&test=true");
        }
    });

    test("functional/showif - Subject 1", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();

        F("#page h2").text("Is John");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Unless Jack");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Not Jack");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });

    test("functional/showif - Subject 2", function () {
        expect(0);
        F("#subjectNumber").type("2");
        F("#loginButton").visible().click();

        F("#page h2").text("Is Jack");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Unless John");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Not John");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });
});
