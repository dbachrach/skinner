define (["underscore"], function (_) {
    "use strict";

    var ONE_SECOND = 1000;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR   = 60 * ONE_MINUTE;
    var ONE_DAY    = 24 * ONE_HOUR;
    var ONE_YEAR   = 365 * ONE_DAY;

    function parseTimeInterval(interval) {
        if (_.isUndefined(interval)) {
            return undefined;
        }

        var matches = interval.match(/^([+-]?\d+) *(.*)$/);
        console.log("matches is " + matches);
        if (!matches) {
            return undefined;
        }

        var number = parseInt(matches[1], 10);
        var word = matches[2].toLowerCase();
        console.log("num word: " + number + " " + word);

        var timeUnits = [
            { "words": ["sec", "secs", "second", "seconds"], "unit": ONE_SECOND },
            { "words": ["min", "mins", "minute", "minutes"], "unit": ONE_MINUTE },
            { "words": ["hr",  "hrs",  "hour",   "hours"],   "unit": ONE_HOUR },
            { "words": ["day", "days"],                      "unit": ONE_DAY },
            { "words": ["yr",  "yrs",  "year",   "years"],   "unit": ONE_YEAR }
        ];

        console.log("timeunits: ");
        console.log(timeUnits);
        console.log("word: " + word);

        var found = _.find(timeUnits, function (timeUnit) {
            return _.contains(timeUnit.words, word);
        });

        if (!found) {
            return undefined;
        }

        return number * found.unit;
    }

    return {
        "parseTimeInterval": parseTimeInterval
    };
});
