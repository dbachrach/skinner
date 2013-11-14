define (["jquery", "underscore"], function ($, _) {
	"use strict";

	function ParseTime(time) {
		if (_.isUndefined(time)) { return undefined; }

		var matches = time.match(/(\d)+ *(.*)/);

		var number = parseInt(matches[0], 10);

		var unit = 1000;
		if (_.contains(["sec", "second", "seconds", "secs"], matches[1]) != -1) {
			unit = 1000;
		}
		else if (_.contains(["min", "minute", "minutes", "mins"], matches[1]) != -1) {
			unit = 60000;
		}

		console.log("Parsed time for " + number + ", unit: " + unit);
		return number * unit;
	}

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
			console.log("matches:");
			console.log(matches);
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

	function LoadLayout(name, bindings, data, afterLoadHandler) {
		$("#page").load("layouts/pages/" + name + ".html", function() {
			_.each(bindings.concat(["nextButton", "prevButton"]), function(binding) {
				var field = $("#" + binding);
				var bindValue = data[binding];
				var bindFile = data[binding + "File"];

				if (bindValue) {
					field.text(bindValue);
					field.prop("value", bindValue);
					field.show();
				}
				else if (bindFile) {
					field.load("content/" + bindFile + ".txt");
					field.show();
				}
				else {
					field.hide();
				}
			});
			if (afterLoadHandler) { afterLoadHandler(); }
		});
	}

	return {
		ParseTime: ParseTime,
		LoadLayout: LoadLayout,
		resolveData: resolveData
	}
});
