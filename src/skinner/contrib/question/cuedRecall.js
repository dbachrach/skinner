define(["jquery", "src/skinner/core/question"], function($, Question) {
	"use strict";

	var CuedRecallQuestion = Question.extend({
		init: function (data, id, testData, style) {
			this._super(data, id, testData, style);
		},
		postShow: function () {
			$("#cuedRecallAnswer").focus();
		},
		selectedAnswer: function() {
			return $("#cuedRecallAnswer").val();
		}
	});
	
	return CuedRecallQuestion;
});
