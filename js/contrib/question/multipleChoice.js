define(["jquery"], function($) {
	"use strict";

	function MultipleChoiceQuestion(question, data) {
		this.question = question;
	}
	MultipleChoiceQuestion.prototype.show = function () {
		console.log("Showing MultipleChoiceQuestion");
	    $("#question").text(this.question.question);

	    $("#answers").empty();

	    _.each(this.question.answers, function (answer, i) {
	    	var answerText = String.fromCharCode(65 + i) + ") " + answer;
	    	$("#answers").append("<input type='radio' name='questionAnswer' id='questionAnswer-" + i + "' /><label for='questionAnswer-" + i + "'>" + answerText + "</label><br />");
	    });
	}
	MultipleChoiceQuestion.prototype.selectedAnswer = function() {
		return "a";
	};
	
	return MultipleChoiceQuestion;
});