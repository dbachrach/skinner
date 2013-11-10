define (["jquery", "underscore", "core/helpers"], function($, _, helpers) {
	"use strict";

	function CountdownPage(data, experiment) {
		this.data = data;
		this.time = helpers.ParseTime(data.time);
		this.experiment = experiment;
	}
	CountdownPage.prototype.show = function() {
		console.log("Showing CountdownPage");

		var base = this;
		helpers.LoadLayout("countdown", ["title", "content"], this.data, function () {
			var count = base.time;
			function countdown(val, completion) {
				console.log("countdown with " + val);
				if (val == 0) {
					completion();
				}
				else {
					$("#countdown").text(val);
					_.delay(countdown, 1000, val - 1, completion);
				}
			}
			countdown(count / 1000, function () {
				base.end();
			});
		});
	};
	CountdownPage.prototype.end = function () {
        this.experiment.nextPage();
    };

	return CountdownPage;
});
