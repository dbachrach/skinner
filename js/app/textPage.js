define (["jquery", "app/helpers"], function(jquery, helpers) {
	"use strict";

	var TextPage = function(data, prevCompletion, nextCompletion) {
		this.data = data;
		this.prevCompletion = prevCompletion;
		this.nextCompletion = nextCompletion;
	}
	TextPage.prototype.show = function() {
		console.log("Showing TextPge");

		var base = this;
		helpers.LoadLayout("text", ["title", "content", "prevButton", "nextButton"], base.data, function() {
			$("#nextButton").click(function() {
				base.next();
			});
			$("#prevButton").click(function() {
				base.prev();
			});
		});
	};
	TextPage.prototype.prev = function() {
		this.prevCompletion();
	}
	TextPage.prototype.next = function() {
		this.nextCompletion();
	}

	return TextPage;
});
