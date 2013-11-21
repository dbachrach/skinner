define (["underscore", "yaml"], function (_, YAML) {
	"use strict";

	function Subject(number, dimensions) {
		this.number = number;
		
		// var dimensions = YAML.load("config/dimensions.yaml")["dimensions"];
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
	}

	/**
	 */
	Subject.prototype.report = function (page, id, name, value) {
		if (!this.reports.hasOwnProperty(page)) {
			this.reports[page] = {};
		}
		if (!this.reports[page].hasOwnProperty(id)) {
			this.reports[page][id] = {};
		}
		this.reports[page][id][name] = value;
		console.log("reports." + page + "." + id + "." + name + " = " + value);
	};
	Subject.prototype.export = function () {
		// console.log("EXPORTS");console.log(this.reports);
		_.each(this.reports, function (ids, page) {
			_.each(ids, function (report, id) {
				// console.log(report);
				var reportString = _.reduce(report, function (memo, value, name) {
					// console.log("reduce with " + memo + " " + value + " " + name);
					return memo + " | " + name.toString() + ":" + value.toString();
				}, "");
				console.log(page.toString() + " | " + id.toString() + reportString);
			});
		});
	}

	return Subject;
});
