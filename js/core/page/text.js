define (["core/helpers"], function(helpers) {
	"use strict";

	function TextPage(data) {
		this.data = data;
	}
	TextPage.prototype.show = function () {
		console.log("Showing TextPage");
		helpers.LoadLayout("text", ["title", "content"], this.data)
	};
	
	return TextPage;
});
