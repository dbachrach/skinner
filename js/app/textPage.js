define (["jquery", "app/helpers"], function(jquery, helpers) {
	"use strict";

	function TextPage(data) {
		this.data = data;
	}
	TextPage.prototype.show = function () {
		console.log("Showing TextPge");
		helpers.LoadLayout("text", ["title", "content"], this.data)
	};
	
	return TextPage;
});
