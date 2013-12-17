define(function (require) {
    var resolver = require("src/skinner/core/resolver");

    module("skinner/core/resolver");

    test("resolver - resolveData", function () {
        var data1 = { x: "hello" };
        deepEqual(resolver.resolveData(data1), data1);

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
        deepEqual(resolver.resolveData(data2, mockSubject), { x: "hello hola" });

        var data3 = { x: "hello {{z.a}}" };
        deepEqual(resolver.resolveData(data3, mockSubject), { x: "hello inner" });

        var data4 = { x: "hello {{z.a}} {{y}}" };
        deepEqual(resolver.resolveData(data4, mockSubject), { x: "hello inner hola" });

        var data5 = { x: "hello {{z.b.c}}" };
        deepEqual(resolver.resolveData(data5, mockSubject), { x: "hello deep" });

        var additionalDimensionData = { "_index": "5" };

        var data6 = { x: "hello {{_index}}" };
        deepEqual(resolver.resolveData(data6, mockSubject, additionalDimensionData), { x: "hello 5" });

        var data7 = { x: "hello {{indexed z.things}}" };
        deepEqual(resolver.resolveData(data7, mockSubject, additionalDimensionData, 0), { x: "hello 100" });

        var data8 = { x: "hello {{indexed z.things}}" };
        deepEqual(resolver.resolveData(data8, mockSubject, additionalDimensionData, 2), { x: "hello 300" });
    });
});
