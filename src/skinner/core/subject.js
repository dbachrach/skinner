define (["underscore", "class"], function (_, Class) {
	"use strict";

	function pathFind(obj, path) {
		return _.reduce(path.split("."), function (o, val) { return o[val]; }, obj);
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
			// 	return 
			// });
			// this.condition = _.reduce(dimensions, function (memo, options, dimension) {
			// 	console.log("dim " + dimension + ": " + options);
			// 	// memo[dimension] = _.sample(options); // TODO: This is random, it should be deterministic
			// 	return 
			// }, {});

			this.reports = {};
		},

		/**
		 */
		report: function (page, id, name, value) {
			if (!this.reports.hasOwnProperty(page)) {
				this.reports[page] = {};
			}
			if (!this.reports[page].hasOwnProperty(id)) {
				this.reports[page][id] = {};
			}
			this.reports[page][id][name] = value;
		},

		export: function () {
			_.each(this.reports, function (ids, page) {
				_.each(ids, function (report, id) {
					var reportString = _.reduce(report, function (memo, value, name) {
						return memo + " | " + name.toString() + ":" + value.toString();
					}, "");
					console.log(page.toString() + " | " + id.toString() + reportString);
				});
			});
		},

		conditionForPath: function (path) {
			return pathFind(this.condition, path);
		}
	});

	return Subject;
});
