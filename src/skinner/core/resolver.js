define (["lib/lodash", "lib/Handlebars", "src/skinner/core/keypath"], function (_, Handlebars, keyPath) {
    "use strict";

    function resolveData(data, subject, additionalDimensionData, context) {
        var allContext = keyPath(subject, "condition", {});
        if (!_.isUndefined(additionalDimensionData)) {
            allContext = _.extend({}, allContext, additionalDimensionData);
        }

        Handlebars.registerHelper("indexed", function (key) {
            return key[context];
        });

        Handlebars.registerHelper("reported", function (page, id, key) {
            for (var i = 0; i < subject.reports.length; i++) {
                var report = subject.reports[i];
                if (report.page === page && report.id === id) {
                    return report[key];
                }
            }
            return null;
        });


        function mapper(value) {
            if (_.isArray(value) || _.isObject(value)) {
                return resolveData(value, subject, additionalDimensionData, context);
            }
            else if (_.isString(value)) {
                var template = Handlebars.compile(value);
                return template(allContext);
            }
            else {
                return value;
            }
        }

        if (_.isArray(data)) {
            return _.map(data, mapper);
        }
        else {
            return _.mapValues(data, mapper);
        }
    }

    return {
        "resolveData": resolveData
    };
});
