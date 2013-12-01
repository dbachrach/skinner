define (["lib/jquery", "lib/underscore", "src/skinner/core/page", "src/skinner/core/intervals"], function($, _, Page, intervals) {
	"use strict";

	var CountdownPage = Page.extend({

		init: function (data, task) {
			this._super(data, task);

			this.time = intervals.parseTimeInterval(this.data.time);
		},
		postShow: function() {
			var base = this;

			function countdown(val, completion) {
				if (val === 0) {
					completion();
				}
				else {
					$("#countdown").text(val);
					_.delay(countdown, 1000, val - 1, completion);
				}
			}

			var count = this.time / 1000;
			countdown(count, function () {
				base.moveToNextPage();
			});
		},
	});

	return CountdownPage;
});
