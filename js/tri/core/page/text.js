define (["tri/core/helpers"], function(helpers) {
	"use strict";

	function TextPage(data, trial) {
		this.data = data;
		this.trial = trial;
		this.bindable = ["title", "content"];
	}
	
	return TextPage;
});
