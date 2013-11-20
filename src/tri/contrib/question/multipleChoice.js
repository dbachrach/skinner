define(["jquery", "underscore"], function($, _) {
	"use strict";

	function MultipleChoiceQuestion(question, id, data) {
		this.question = question;
		this.question.id = id;
		console.log("Creating question with id " + id);
	}
	MultipleChoiceQuestion.prototype.show = function () {
		console.log("Showing MultipleChoiceQuestion");
	    $("#question").text(this.question.question);

	    $("#answers").empty();

	    _.each(this.question.answers, function (answer, i) {
	    	var answerText = String.fromCharCode(65 + i) + ") " + answer;
	    	$("#answers").append("<input class='ui radio checkbox' type='radio' name='questionAnswer' id='questionAnswer-" + i + "' value='" + i + "' /><label for='questionAnswer-" + i + "'>" + answerText + "</label><br />");
	    });
	}
	MultipleChoiceQuestion.prototype.selectedAnswer = function() {
		return $("input[name=questionAnswer]:checked").val();
	};
	
	return MultipleChoiceQuestion;
});
