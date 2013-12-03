define (["lib/jquery", "lib/underscore", "lib/underscore.string"], function ($, _) {
    "use strict";

    function resolveData(data, subject, additionalDimensionData, context) {
        var resolvedData = {};
        _.each(data, function (value, key) {
            resolvedData[key] = resolveDimensions(value, subject, additionalDimensionData, context);
        });
        return resolvedData;
    }

    function resolveDimensions(value, subject, additionalDimensionData, context) {
        var re = /{{(.*)}}/g;
        var matches = re.exec(value); // TODO: Only matches once
        if (matches) {
            // console.log("matches:");
            // console.log(matches);
            // _.each(matches, function (match) {

            var isInContext = false;
            if (_.startsWith(matches[1], ("%")) && !_.startsWith(matches[1], "%%")) {
                isInContext = true;
                matches[1] = matches[1].substring(1); // Strip off the % character
            }

            var searchPath = matches[1].split(".");
            console.log("searchPath");console.log(searchPath);
            var x;
            if (searchPath.length === 1) {
                x = subject.condition[searchPath[0]];
                if (!x) {
                    x = additionalDimensionData[searchPath[0]];
                }
            }
            else if (searchPath.length === 2) {
                x = subject.condition[searchPath[0]][searchPath[1]];
            }
            // TODO: Generic and support more than 2 parts in the search path
            // TODO: Support {{x}}...{{y}}

            // TODO: Only do this if x is an array
            if (isInContext) {
                console.log("x: " + x);
                if (_.isUndefined(context)) {
                    console.log("ERROR: context must be defined when using %");
                }
                // TODO: Check for index property in context
                x = x[context.index];
            }

            value = value.replace(matches[0], x);
            // });
            // console.log(matches);
        }
        return value;
    }

    return {
        "resolveData": resolveData
    };
});
