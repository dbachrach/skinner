define (["lib/lodash", "lib/underscore.string", "lib/class", "src/skinner/core/keypath"], function (_, _s, Class, keyPath) {
    "use strict";

    var Subject = Class.extend({

        init: function (number, dimensions) {
            this.number = number;

            this.condition = {};

            var conditionSize = _.reduce(dimensions, function (size, options) {
                return size * options.length;
            }, 1);

            var conditionNumber = (this.number - 1) % conditionSize;

            var base = this;
            _.reduce(dimensions, function (previousOptionCount, options, dimension) {
                var currentOptionCount = options.length;
                var offset = (Math.floor(conditionNumber / previousOptionCount)) % currentOptionCount;

                base.condition[dimension] = options[offset];
                return previousOptionCount * currentOptionCount;
            }, 1);

            this.reports = [];
        },

        /**
         * @param pageId The page id that is reporting data
         * @param contextId An additional context id for the data being reported
         *                For example, when a TestPage reports data, the contextId is the Question Id.
         */
        report: function (pageId, contextId, name, value) {
            var report = _.findWhere(this.reports, { page: pageId, id: contextId, subject: this.number });
            if (_.isUndefined(report)) {
                report = {
                    page: pageId,
                    id: contextId,
                    subject: this.number
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
            return {
              html: _.map(headers, quoter).join(",") + "<br/>" + rows.join("<br/>"),
              csv: _.map(headers, quoter).join(",") + "\n" + rows.join("\n")
            };
        },

        conditionForPath: function (path) {
            return keyPath(this.condition, path, undefined);
        }
    });

    return Subject;
});
