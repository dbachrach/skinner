define(function (require) {
    module("functional/simple-step", {
        setup: function () {
            F.open("../index.html?config=simplestep&test=true");
        }
    });

    test("functional/simple-step", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Test 2");
        F("#page .rendered-content").text("A Simple Test 2");
        F("#nextButton .content").html("Next 2").click();

        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });
});
