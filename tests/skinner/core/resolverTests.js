define(function (require) {
    var resolver = require("src/skinner/core/resolver");

    QUnit.module("skinner/core/resolver");

    QUnit.test("resolver - resolveData", function () {
        var data1 = { x: "hello" };
        QUnit.deepEqual(resolver.resolveData(data1), data1);

        var mockSubject = {
            condition: {
                y: "hola",
                z: {
                    a: "inner",
                    b: {
                        c: "deep"
                    },
                    things: [
                        100,
                        200,
                        300
                    ]
                }
            }
        };

        var data2 = { x: "hello {{y}}"};
        QUnit.deepEqual(resolver.resolveData(data2, mockSubject), { x: "hello hola" });

        var data3 = { x: "hello {{z.a}}" };
        QUnit.deepEqual(resolver.resolveData(data3, mockSubject), { x: "hello inner" });

        var data4 = { x: "hello {{z.a}} {{y}}" };
        QUnit.deepEqual(resolver.resolveData(data4, mockSubject), { x: "hello inner hola" });

        var data5 = { x: "hello {{z.b.c}}" };
        QUnit.deepEqual(resolver.resolveData(data5, mockSubject), { x: "hello deep" });

        var additionalDimensionData = { "_index": "5" };

        var data6 = { x: "hello {{_index}}" };
        QUnit.deepEqual(resolver.resolveData(data6, mockSubject, additionalDimensionData), { x: "hello 5" });

        var data7 = { x: "hello {{indexed z.things}}" };
        QUnit.deepEqual(resolver.resolveData(data7, mockSubject, additionalDimensionData, 0), { x: "hello 100" });

        var data8 = { x: "hello {{indexed z.things}}" };
        QUnit.deepEqual(resolver.resolveData(data8, mockSubject, additionalDimensionData, 2), { x: "hello 300" });
    });
});
