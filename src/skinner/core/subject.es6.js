import _ from 'lodash';
// import _ from 'lodash'; underscore.string
import keyPath from './keypath.js';

export default class Subject {
  constructor(number, dimensions) {
    super();

    this.number = number;

    this.condition = {};

    const conditionSize = _.reduce(dimensions, (size, options) => {
      return size * options.length;
    }, 1);

    const conditionNumber = (this.number - 1) % conditionSize;

    _.reduce(dimensions, (previousOptionCount, options, dimension) => {
        const currentOptionCount = options.length;
        const offset = (Math.floor(conditionNumber / previousOptionCount)) % currentOptionCount;

        this.condition[dimension] = options[offset];
        return previousOptionCount * currentOptionCount;
    }, 1);

    this.reports = [];
  },

  /**
   * @param pageId The page id that is reporting data
   * @param contextId An additional context id for the data being reported
   *                For example, when a TestPage reports data, the contextId is the Question Id.
   */
  report(pageId, contextId, name, value) {
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

  exportToCSV() {
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
      return _.map(headers, quoter).join(",") + "<br/>" + rows.join("<br/>");
  },

  conditionForPath(path) {
      return keyPath(this.condition, path, undefined);
  }
});
