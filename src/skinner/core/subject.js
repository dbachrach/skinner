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
	Subject.prototype.report = function(page, key, value, tags) {
		if (!_.contains(this.reports, page)) {
			this.reports[page] = {};
		}
		this.reports[page][key] = { "value": value, "tags": tags };
		console.log("reports." + page + "." + key + " = " + value + ", tags= " + tags);
	};

	return Subject;
});
