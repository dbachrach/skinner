define (["lib/underscore", "lib/class", "lib/underscore.string"], function (_, Class) {
    "use strict";

    function pathFind(obj, path, defaultValue) {
        var foundValue = _.reduce(path.split("."), function (o, val) {
            if (!_.isUndefined(o) && o.hasOwnProperty(val)) {
                return o[val];
            }
            else {
                return undefined;
            }
            return o[val];
        }, obj);

        if (_.isUndefined(foundValue)) {
            return defaultValue;
        }
        else {
            return foundValue;
        }
    }

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
         */
        report: function (page, id, name, value) {
            var report = _.findWhere(this.reports, { page: page, id: id});
            if (_.isUndefined(report)) {
                report = {
                    page: page,
                    id: id
                };
                this.reports.push(report);
            }

            report[name] = value;
        },

        exportToCSV: function () {
            function quoter (str) {
                return _.quote(str);
            }

            var headers = _.union.apply(this, _.map(this.reports, function (report) {
                return _.keys(report);
            }));

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
            return pathFind(this.condition, path, undefined);
        }
    });

    return Subject;
});
