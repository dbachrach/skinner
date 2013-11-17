define (["jquery", "underscore", "src/tri/core/intervals"], function($, _, intervals) {
	"use strict";

	function CountdownPage(data, task) {
		this.data = data;
		this.time = intervals.parseTimeInterval(data.time);
		this.task = task;
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
        this.task.next();
    };

	return CountdownPage;
});
