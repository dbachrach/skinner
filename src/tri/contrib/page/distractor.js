define (["underscore", "tri/core/helpers"], function(_, helpers) {
	"use strict";

	function DistractorPage(data, trial) {
		this.data = data;
		this.trial = trial;
		this.exercise = this.data.exercise;
	}
	
	return DistractorPage;
});
