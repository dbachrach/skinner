define (["lib/lodash", "lib/underscore.string", "lib/class", "src/skinner/core/keyPath"], function (_, _s, Class, keyPath) {
    "use strict";

    var Subject = Class.extend({

        init: function (number, dimensions) {
            this.number = number;

            this.condition = {};
            var base = this;
            _.each(dimensions, function (options, dimension) {
                // console.log("dim " + dimension + ": " + options);
                base.condition[dimension] = _.sample(options); // TODO: This is random, it should be deterministic
                console.log("Subject[" + dimension + "] = ");
                console.log(base.condition[dimension]);
            });
            // this.condition = _.map(dimensions, function (options, dimension) {
            //  return
            // });
            // this.condition = _.reduce(dimensions, function (memo, options, dimension) {
            //  console.log("dim " + dimension + ": " + options);
            //  // memo[dimension] = _.sample(options); // TODO: This is random, it should be deterministic
            //  return
            // }, {});

            this.reports = [];
        },

        /**
         * @param pageId The page id that is reporting data
         * @param contextId An additional context id for the data being reported
         *                For example, when a TestPage reports data, the contextId is the Question Id.
         */
        report: function (pageId, contextId, name, value) {
            var report = _.findWhere(this.reports, { page: pageId, context: contextId});
            if (_.isUndefined(report)) {
                report = {
                    page: pageId,
                    id: contextId
                };
                this.reports.push(report);
            }

            report[name] = value;
        },

        exportToCSV: function () {
            function quoter (str) {
                return _s.quote(str);
            }

            var headers = _.union.apply(this, _.map(this.reports, function (report) {
                return _.keys(report);
            }));

            // todo: sort this.reports use _.sort based on page, then id.
            var rows = _.map(this.reports, function (report) {
                var row = _.map(headers, function (key) {
                    var value = report[key];
                    if (_.isUndefined(value)) {
                        value = "";
                    }
                    return value.toString();
                });
                return _.map(row, quoter).join(",");
            });
            return _.map(headers, quoter).join(",") + "\n" + rows.join("\n");
        },

        conditionForPath: function (path) {
            return keyPath(this.condition, path, undefined);
        }
    });

    return Subject;
});
