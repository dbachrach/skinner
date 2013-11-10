define (["core/helpers"], function(helpers) {
	"use strict";

	function TextPage(data, experiment) {
		this.data = data;
		this.experiment = experiment;
	}
	TextPage.prototype.show = function () {
		console.log("Showing TextPage");
		helpers.LoadLayout("text", ["title", "content"], this.data, this.experiment)
	};
	
	return TextPage;
});
