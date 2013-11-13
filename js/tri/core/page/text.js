define (["tri/core/helpers"], function(helpers) {
	"use strict";

	function TextPage(data, experiment) {
		this.data = data;
		this.experiment = experiment;
		this.bindable = ["title", "content"];
	}
	
	return TextPage;
});
