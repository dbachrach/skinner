define (["jquery", "underscore"], function ($, underscore) {
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
		LoadLayout: function (name, bindings, data, afterLoadHandler) {
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
	}
});
