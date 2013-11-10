define(["jquery", "underscore"], function($, _) {
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
	    	$("#answers").append("<input type='radio' name='questionAnswer' id='questionAnswer-" + i + "' value='" + i + "' /><label for='questionAnswer-" + i + "'>" + answerText + "</label><br />");
	    });
	}
	MultipleChoiceQuestion.prototype.selectedAnswer = function() {
		console.log($("input[name=questionAnswer]:checked"));
		console.log($("input[name=questionAnswer]:checked").val());
		return $("input[name=questionAnswer]:checked").val();
	};
	
	return MultipleChoiceQuestion;
});
