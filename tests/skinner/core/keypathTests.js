define(function (require) {
    var keypath = require("src/skinner/core/keypath");

    module("skinner/core/keypath");

    test("keypath - undefined", function () {
        equal(keypath(undefined, "a"), undefined);
        equal(keypath(undefined, undefined), undefined);
        equal(keypath(undefined, undefined, undefined), undefined);
        equal(keypath(undefined, "a", "abc"), "abc");
        equal(keypath(undefined, undefined, "abc"), "abc");
    });

    test("keypath - non object", function () {
        equal(keypath("sample string", "a"), undefined);
        equal(keypath("sample string", undefined), undefined);
        equal(keypath("sample string", undefined, undefined), undefined);
        equal(keypath("sample string", "a", "abc"), "abc");
        equal(keypath("sample string", undefined, "abc"), "abc");
    });

    test("keypath - invalid path", function () {
        equal(keypath({a: 5}, ""), undefined);
        equal(keypath({a: 5}, "", "test"), "test");
        equal(keypath({a: 5}, {}, "test"), "test");
        equal(keypath({a: 5}, true, "test"), "test");
        equal(keypath({a: 5}, ".", "test"), "test");
    });

    test("keypath - single level", function () {
        equal(keypath({a: 5}, "a"), 5);
        equal(keypath({a: "sample string"}, "a"), "sample string");
        equal(keypath({"many words": "a value"}, "many words"), "a value");
        equal(keypath({a: 10, aa: 20}, "aa"), 20);
    });

    test("keypath - multiple level", function () {
        equal(keypath({a: 5, b: { c: 20 } }, "b.c"), 20);
        equal(keypath({a: 5, b: { "many words": 500 } }, "b.many words"), 500);
        equal(keypath({a: 5, "many words": { c: "sample string" } }, "many words.c"), "sample string");
        equal(keypath({a: 5, "many words": { "more words": "sample string" } }, "many words.more words"), "sample string");
        equal(keypath({a: 5, b: { c: { d: "sample string" } } }, "b.c.d"), "sample string");
        equal(keypath({a: 5, "many words": { "more words": { "even more": "sample string" } } }, "many words.more words.even more"), "sample string");
    });

    test("keypath - not found (no default value)", function () {
        equal(keypath({a: 5, b: { c: 20 } }, "e"), undefined);
        equal(keypath({a: 5, b: { c: 20 } }, "c"), undefined);
        equal(keypath({a: 5, b: { c: 20 } }, "multi word"), undefined);
        equal(keypath({"multi word": 5, b: { c: 20 } }, "multiword"), undefined);
        equal(keypath({a: 5, b: { c: 20 } }, "b.a"), undefined);
        equal(keypath({a: 5, b: { "two words": 20 } }, "b.twowords"), undefined);
    });

    test("keypath - not found (use default value)", function () {
        equal(keypath({a: 5, b: { c: 20 } }, "e", 50), 50);
        equal(keypath({a: 5, b: { c: 20 } }, "c", "test"), "test");
        equal(keypath({a: 5, b: { c: 20 } }, "multi word", 50), 50);
        equal(keypath({"multi word": 5, b: { c: 20 } }, "multiword", true), true);
        equal(keypath({a: 5, b: { c: 20 } }, "b.a", false), false);
        equal(keypath({a: 5, b: { "two words": 20 } }, "b.twowords", undefined), undefined);
    });
});
