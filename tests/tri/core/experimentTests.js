define(function (require) {
    var Experiment = require("src/tri/core/experiment");
    
    QUnit.module("tri/core/experiment");
    
    QUnit.test("experiment - Creation", function () { 
        var e = new Experiment();
        QUnit.ok(e);
    });

});
