define (["underscore", "core/helpers"], function(_, helpers) {
	"use strict";

	function DistractorPage(data) {
		this.data = data;
	}
	DistractorPage.prototype.show = function() {
		console.log("Showing DistractorPage");

		var bindData = {"content" : "You are now going to play tetris for 9 minutes."};
		helpers.LoadLayout("distractor", _.keys(bindData), bindData);
	};

	return DistractorPage;
});
