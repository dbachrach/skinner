define (["jquery", "app/helpers"], function(jquery, helpers) {
	"use strict";

	function TextPage(data, prevCompletion, nextCompletion) {
		this.data = data;
		this.prevCompletion = prevCompletion;
		this.nextCompletion = nextCompletion;
	}
	TextPage.prototype.show = function () {
		console.log("Showing TextPge");

		var base = this;
		helpers.LoadLayout("text", ["title", "content", "prevButton", "nextButton"], base.data, function() {
			$("#nextButton").click(base.nextCompletion);
			$("#prevButton").click(base.prevCompletion);
		});
	};
	
	return TextPage;
});
