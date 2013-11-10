define (["underscore", "yaml"], function (_, yaml) {
	"use strict";

	function Subject(number) {
		this.number = number;
		
		var dimensions = YAML.load("config/dimensions.yaml")["dimensions"];
		this.condition = {};
		var base = this;
		_.each(dimensions, function (options, dimension) {
			console.log("dim " + dimension + ": " + options);
			base.condition[dimension] = _.sample(options); // TODO: This is random, it should be deterministic
		});
		// this.condition = _.map(dimensions, function (options, dimension) {
		// 	return 
		// });
		// this.condition = _.reduce(dimensions, function (memo, options, dimension) {
		// 	console.log("dim " + dimension + ": " + options);
		// 	// memo[dimension] = _.sample(options); // TODO: This is random, it should be deterministic
		// 	return 
		// }, {});
	}

	return Subject;
});
