define(function (require) {
    module("functional/simple-text", {
        setup: function () {
            F.open("../index.html?config=simpletext&test=true");
        }
    });

    test("functional/simple-text", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");
        F("#nextButton .content").html("Next").click();
        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });


    module("functional/simple-text-file", {
        setup: function () {
            F.open("../index.html?config=simpletextfile&test=true");
        }
    });

    test("functional/simple-text-file", function () {
        expect(0);
        F("#subjectNumber").type("1");
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test From a File");
        F("#nextButton .content").html("Next").click();
        F("#page h2").text("Finished");
        F("#page .rendered-content").text("Finished the test");
    });
});
