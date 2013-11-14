define (["jquery", "underscore", "tri/core/helpers"], function($, _, helpers) {
	"use strict";

	function CountdownPage(data, trial) {
		this.data = data;
		this.time = helpers.ParseTime(data.time);
		this.trial = trial;
		this.bindable = ["title", "content"];
	}
	CountdownPage.prototype.show = function() {
		console.log("Showing CountdownPage");

		var base = this;
		
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

		var count = this.time / 1000;
		countdown(count, function () {
			base.end();
		});
	};
	CountdownPage.prototype.end = function () {
        this.trial.nextPage();
    };

	return CountdownPage;
});
