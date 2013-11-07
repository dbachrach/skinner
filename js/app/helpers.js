define (["jquery", "underscore"], function (jquery, underscore) {
	"use strict";

	return {
		ParseTime: function (time) {
			matches = time.match(/(\d)+ *(.*)/);

			var number = parseInt(matches[0]);

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
				_.each(bindings, function(binding) {
					var field = $("#" + binding);
					var bindValue = data[binding];
					var bindFile = data[binding + "File"];

					if (bindValue) {
						field.text(bindValue);
						field.prop("value", bindValue);
					}
					else if (bindFile) {
						field.load("content/" + bindFile + ".txt");
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
