define(function (require) {
    module("functional/simple", {
        setup: function () {
            F.open("../index.html?config=simple");
        }
    });

    test("functional/simple", function () {
        expect(0);
        F("#loginButton").visible().click();
        F("#page h2").text("Test");
        F("#page .rendered-content").text("A Simple Test");
    });
});
