define(["jquery"], function($) {
	"use strict";

	function CuedRecallQuestion(question, data) {
		this.question = question;
	}
	CuedRecallQuestion.prototype.show = function () {
		console.log("Showing CuedRecallQuestion");
	    $("#question").text(this.question.question);
	    $("#cuedRecallAnswer").val("");
	}
	CuedRecallQuestion.prototype.selectedAnswer = function() {
		return $("#cuedRecallAnswer").val();
	};
	
	return CuedRecallQuestion;
});