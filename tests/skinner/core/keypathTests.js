define(function (require) {
    var keypath = require("src/skinner/core/keypath");

    QUnit.module("skinner/core/keypath");

    QUnit.test("keypath - undefined", function () {
        QUnit.equal(keypath(undefined, "a"), undefined);
        QUnit.equal(keypath(undefined, undefined), undefined);
        QUnit.equal(keypath(undefined, undefined, undefined), undefined);
        QUnit.equal(keypath(undefined, "a", "abc"), "abc");
        QUnit.equal(keypath(undefined, undefined, "abc"), "abc");
    });

    QUnit.test("keypath - non object", function () {
        QUnit.equal(keypath("sample string", "a"), undefined);
        QUnit.equal(keypath("sample string", undefined), undefined);
        QUnit.equal(keypath("sample string", undefined, undefined), undefined);
        QUnit.equal(keypath("sample string", "a", "abc"), "abc");
        QUnit.equal(keypath("sample string", undefined, "abc"), "abc");
    });

    QUnit.test("keypath - invalid path", function () {
        QUnit.equal(keypath({a: 5}, ""), undefined);
        QUnit.equal(keypath({a: 5}, "", "test"), "test");
        QUnit.equal(keypath({a: 5}, {}, "test"), "test");
        QUnit.equal(keypath({a: 5}, true, "test"), "test");
        QUnit.equal(keypath({a: 5}, ".", "test"), "test");
    });

    QUnit.test("keypath - single level", function () {
        QUnit.equal(keypath({a: 5}, "a"), 5);
        QUnit.equal(keypath({a: "sample string"}, "a"), "sample string");
        QUnit.equal(keypath({"many words": "a value"}, "many words"), "a value");
        QUnit.equal(keypath({a: 10, aa: 20}, "aa"), 20);
    });

    QUnit.test("keypath - multiple level", function () {
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "b.c"), 20);
        QUnit.equal(keypath({a: 5, b: { "many words": 500 } }, "b.many words"), 500);
        QUnit.equal(keypath({a: 5, "many words": { c: "sample string" } }, "many words.c"), "sample string");
        QUnit.equal(keypath({a: 5, "many words": { "more words": "sample string" } }, "many words.more words"), "sample string");
        QUnit.equal(keypath({a: 5, b: { c: { d: "sample string" } } }, "b.c.d"), "sample string");
        QUnit.equal(keypath({a: 5, "many words": { "more words": { "even more": "sample string" } } }, "many words.more words.even more"), "sample string");
    });

    QUnit.test("keypath - not found (no default value)", function () {
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "e"), undefined);
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "c"), undefined);
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "multi word"), undefined);
        QUnit.equal(keypath({"multi word": 5, b: { c: 20 } }, "multiword"), undefined);
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "b.a"), undefined);
        QUnit.equal(keypath({a: 5, b: { "two words": 20 } }, "b.twowords"), undefined);
    });

    QUnit.test("keypath - not found (use default value)", function () {
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "e", 50), 50);
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "c", "test"), "test");
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "multi word", 50), 50);
        QUnit.equal(keypath({"multi word": 5, b: { c: 20 } }, "multiword", true), true);
        QUnit.equal(keypath({a: 5, b: { c: 20 } }, "b.a", false), false);
        QUnit.equal(keypath({a: 5, b: { "two words": 20 } }, "b.twowords", undefined), undefined);
    });
});
