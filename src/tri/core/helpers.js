define (["jquery", "underscore"], function ($, _) {
	"use strict";

	function resolveData(data, subject) {
		var resolvedData = {};
		_.each(data, function (value, key) {
			resolvedData[key] = resolveDimensions(value, subject);
		});
		return resolvedData;
	}

	function resolveDimensions(value, subject) {
		// TODO: Have to use a '>' cause of YAML for now
		var re = />*{{(.*)}}/g;
		var matches = re.exec(value); // TODO: Only matches once
		if (matches) {
			// console.log("matches:");
			// console.log(matches);
			// _.each(matches, function (match) {

			var searchPath = matches[1].split(".");
			var x;
			if (searchPath.length == 1) {
				if (searchPath[0] == "NUM") x = "1"; // TODO: Remove this if statement
				else x = subject.condition[searchPath[0]];
			}
			else if (searchPath.length == 2) {
				x = subject.condition[searchPath[0]][searchPath[1]];
			}
			// TODO: Generic and support more than 2 parts in the search path
			
			value = value.replace(matches[0], x);
			// });
			// console.log(matches);
		}
		return value;
	}

	return {
		resolveData: resolveData
	}
});
