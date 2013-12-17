define(function (require) {
    var Experiment = require("src/skinner/core/experiment");

    module("functional/functional", {
        setup: function () {
            F.open("../index.html");
        }
    });

    test('Hello World!', function () {
        expect(0);
        F("#loginButton").visible().click();
    });
});
