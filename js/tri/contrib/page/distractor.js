define (["underscore", "tri/core/helpers"], function(_, helpers) {
	"use strict";

	function DistractorPage(data) {
		this.data = data;

		var bindData = {"content" : "You are now going to play tetris for 9 minutes."};
		this.bindable = _.keys(bindData);
		this.extendedBindContent = bindData;
	}
	
	return DistractorPage;
});
