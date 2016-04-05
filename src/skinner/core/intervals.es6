import _ from 'lodash';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR   = 60 * ONE_MINUTE;
const ONE_DAY    = 24 * ONE_HOUR;
const ONE_YEAR   = 365 * ONE_DAY;

/**
 * Parses a string for a timer interval.
 * For example "2 minutes" returns a time interval of 120,000 milliseconds.
 * @param interval The string that represents a time interval.
 * @returns The time interval in milliseconds. Returns `undefined` if parsing fails.
 */
export const parseTimeInterval = (interval) => {
  // TODO: Use pegjs

  if (_.isUndefined(interval)) {
      return undefined;
  }

  const matches = interval.match(/^([+-]?\d+) *(.*)$/);
  if (!matches) {
      return undefined;
  }

  const number = parseInt(matches[1], 10);
  const word = matches[2].toLowerCase();

  const timeUnits = [
      { "words": ["sec", "secs", "second", "seconds"], "unit": ONE_SECOND },
      { "words": ["min", "mins", "minute", "minutes"], "unit": ONE_MINUTE },
      { "words": ["hr",  "hrs",  "hour",   "hours"],   "unit": ONE_HOUR },
      { "words": ["day", "days"],                      "unit": ONE_DAY },
      { "words": ["yr",  "yrs",  "year",   "years"],   "unit": ONE_YEAR }
  ];

  const found = _.find(timeUnits, timeUnit => {
      return _.contains(timeUnit.words, word);
  });

  if (!found) {
      return undefined;
  }

  return number * found.unit;
};
