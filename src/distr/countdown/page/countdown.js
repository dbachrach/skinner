define (["lib/jquery", "lib/lodash", "src/skinner/core/page", "src/skinner/core/intervals"], function ($, _, Page, intervals) {
	"use strict";

	var CountdownPage = Page.extend({

		init: function (data, task) {
            _.extend(data, { "show timer": true });
			this._super(data, task);
		}
	});

	return CountdownPage;
});
