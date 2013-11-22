define(function (require) {
    var Experiment = require("src/skinner/core/experiment");
    
    QUnit.module("skinner/core/experiment");
    
    QUnit.test("experiment - Creation", function () { 
        var e = new Experiment();
        QUnit.ok(e);
    });

});
