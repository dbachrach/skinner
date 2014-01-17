define(function (require) {
    module("functional/repeat-step", {
        setup: function () {
            F.open("../index.html?config=repeatstep&test=true");
        }
    });

    test("functional/repeat-step", function () {
        expect(0);

        // Login
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();

        // First task, repeats 2 times
        F("#page h2").text("Test James");
        F("#page .rendered-content").text("A Simple Test");
        F("#nextButton .content").html("Next").click();

        F("#page h2").text("Test Jack");
        F("#page .rendered-content").text("A Simple Test");
        F("#nextButton .content").html("Next").click();

        // Second task, repeats 3 times, has in between task
        F("#page h2").text("Test 123");
        F("#page .rendered-content").text("A Simple Test 2");
        F("#nextButton .content").html("Next 2").click();
        F("#page h2").text("In Between");
        F("#page .rendered-content").text("in between content");
        F("#nextButton .content").html("Next In Between").click();

        F("#page h2").text("Test 455");
        F("#page .rendered-content").text("A Simple Test 2");
        F("#nextButton .content").html("Next 2").click();
        F("#page h2").text("In Between");
        F("#page .rendered-content").text("in between content");
        F("#nextButton .content").html("Next In Between").click();

        F("#page h2").text("Test 813");
        F("#page .rendered-content").text("A Simple Test 2");
        F("#nextButton .content").html("Next 2").click();

        // Finish
        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });
});
