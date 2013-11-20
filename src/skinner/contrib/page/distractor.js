define ([], function() {
	"use strict";

	function DistractorPage(data, task) {
		this.data = data;
		this.task = task;
		this.exercise = this.data.exercise;
	}
	
	return DistractorPage;
});
