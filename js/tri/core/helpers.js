define (["jquery", "underscore"], function ($, _) {
	"use strict";

	return {
		ParseTime: function (time) {
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
		},
		// resolveDimensions: function (value) {
		// 	var matches = value.match(/{{(.*)}}/g);
		// 	console.log(matches);
		// },
		LoadLayout: function (name, bindings, data, trial, afterLoadHandler) {
			
			function resolveDimensions(value) {
				var re = /{{(.*)}}/g;
				var matches = re.exec(value); // TODO: Only matches once
				if (matches) {
					console.log(matches);
					// _.each(matches, function (match) {
						var x = trial.subject.condition[matches[1]];
						x = x.replace(" ", "");
						value = value.replace(matches[0], x);
					// });
					// console.log(matches);
				}
				return value;
			}

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
						bindFile = resolveDimensions(bindFile);
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
	}
});
