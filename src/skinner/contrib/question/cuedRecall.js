define(["jquery"], function($) {
	"use strict";

	function CuedRecallQuestion(question, id, data) {
		this.question = question;
		this.id = id;
		this.correctAnswer = question.correctAnswer;
	}
	CuedRecallQuestion.prototype.show = function () {
		console.log("Showing CuedRecallQuestion");
	    $("#question").text(this.question.question);
	    $("#cuedRecallAnswer").val("").focus();
	}
	CuedRecallQuestion.prototype.selectedAnswer = function() {
		return $("#cuedRecallAnswer").val();
	};
	
	return CuedRecallQuestion;
});