define (["jquery", "underscore"], function ($, _) {
	"use strict";

	if (!String.prototype.endsWith) {
        Object.defineProperty(String.prototype, 'endsWith', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (searchString, position) {
                position = position || this.length;
                position = position - searchString.length;
                var lastIndex = this.lastIndexOf(searchString);
                return lastIndex !== -1 && lastIndex === position;
            }
        });
    }

	function resolveData(data, subject, additionalDimensionData, context) {
		var resolvedData = {};
		_.each(data, function (value, key) {
			resolvedData[key] = resolveDimensions(value, subject, additionalDimensionData, context);
		});
		return resolvedData;
	}

	function resolveDimensions(value, subject, additionalDimensionData, context) {
		var re = /{{(.*)}}/g;
		var matches = re.exec(value); // TODO: Only matches once
		if (matches) {
			// console.log("matches:");
			// console.log(matches);
			// _.each(matches, function (match) {

			var isInContext = false;
			if (matches[1].startsWith("%") && !matches[1].startsWith("%%")) {
				isInContext = true;
				matches[1] = matches[1].substring(1); // Strip off the % character
			}

			var searchPath = matches[1].split(".");
			console.log("searchPath");console.log(searchPath);
			var x;
			if (searchPath.length == 1) {
				x = subject.condition[searchPath[0]];
				if (!x) {
					x = additionalDimensionData[searchPath[0]];
				}
			}
			else if (searchPath.length == 2) {
				x = subject.condition[searchPath[0]][searchPath[1]];
			}
			// TODO: Generic and support more than 2 parts in the search path
			// TODO: Support {{x}}...{{y}}

			// TODO: Only do this if x is an array
			if (isInContext) {
				console.log("x: " + x);
				if (_.isUndefined(context)) {
					console.log("ERROR: context must be defined when using %");
				}
				// TODO: Check for index property in context
				x = x[context.index];
			}
			
			value = value.replace(matches[0], x);
			// });
			// console.log(matches);
		}
		return value;
	}

	function readDimension(value, subject) {
		// TODO: Handle across somewhere else
		var re = /^across {{(.*)}}$/; // TODO: No 'the'
		var matches = re.exec(value); // TODO: Only matches once
		if (matches) {
			var searchPath = matches[1].split(".");
			// TODO: other lengths
			if (searchPath.length == 2) {
				return subject.condition[searchPath[0]][searchPath[1]];
			}
		}
		else {
			return undefined;
		}
	}

	return {
		"resolveData": resolveData,
		"readDimension": readDimension
	}
});
