define(function (require) {
    var Page = require("src/skinner/core/page");

    module("skinner/core/page");

    test("page - Defaults", function () {
        var p = new Page();
        ok(p);
    });

    test("page - id()", function () {
        var mockTask = { id: function () { return "MyTask"; } };

        var pageData = { "type": "MyType" };
        var p = new Page(pageData, mockTask);
        equal(p.id(), "MyTask-MyType");
    });

    test("page - layoutname()", function () {
        var pageData = { "type": "MyType" };
        var p = new Page(pageData);
        equal(p.layoutName(), "MyType");
    });

    function expectWithin(milliseconds) {
        return setTimeout(function () {
            ok(false, "Failed to fire. Expected within " + milliseconds + " milliseconds.")
        }, milliseconds)
    }

    asyncTest("page - timer", function () {
        var pageData = { "time": "1 second" };
        var p = new Page(pageData);

        var expecting = expectWithin(1500);

        p.next = function () {
            clearTimeout(expecting);
            ok(true, "Next called");
            start();
        }

        p.startPageTimer();
    });
});
