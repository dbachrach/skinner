define (["lib/jquery", "lib/lodash", "src/skinner/core/page", "src/skinner/core/intervals"], function ($, _, Page, intervals) {
	"use strict";

	var CountdownPage = Page.extend({

		init: function (data, task) {
			this._super(data, task);

			this.time = intervals.parseTimeInterval(this.data.time);
		},
		postShow: function () {
			var base = this;

			function countdown(val) {
				if (val > 0) {
					$("#countdown").text(val);
					_.delay(countdown, 1000, val - 1);
				}
			}

			var count = this.time / 1000;
			countdown(count);
		},
	});

	return CountdownPage;
});
