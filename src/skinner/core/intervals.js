define (["lib/lodash"], function (_) {
    "use strict";

    var ONE_SECOND = 1000;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR   = 60 * ONE_MINUTE;
    var ONE_DAY    = 24 * ONE_HOUR;
    var ONE_YEAR   = 365 * ONE_DAY;

    /**
     * Parses a string for a timer interval.
     * For example "2 minutes" returns a time interval of 120,000 milliseconds.
     * @param interval The string that represents a time interval.
     * @returns The time interval in milliseconds. Returns `undefined` if parsing fails.
     */
    function parseTimeInterval(interval) {
        if (_.isUndefined(interval)) {
            return undefined;
        }

        var matches = interval.match(/^([+-]?\d+) *(.*)$/);
        if (!matches) {
            return undefined;
        }

        var number = parseInt(matches[1], 10);
        var word = matches[2].toLowerCase();

        var timeUnits = [
            { "words": ["sec", "secs", "second", "seconds"], "unit": ONE_SECOND },
            { "words": ["min", "mins", "minute", "minutes"], "unit": ONE_MINUTE },
            { "words": ["hr",  "hrs",  "hour",   "hours"],   "unit": ONE_HOUR },
            { "words": ["day", "days"],                      "unit": ONE_DAY },
            { "words": ["yr",  "yrs",  "year",   "years"],   "unit": ONE_YEAR }
        ];

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
