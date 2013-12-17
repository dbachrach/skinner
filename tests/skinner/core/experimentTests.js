define(function (require) {
    var Experiment = require("src/skinner/core/experiment");

    module("skinner/core/experiment");

    test("experiment - Creation", function () {
        var e = new Experiment();
        ok(e);
    });

});
