define(["jquery", "underscore"], function($, _) {
	"use strict";

	function MultipleChoiceQuestion(question, id, data) {
		this.question = question;
		this.id = id;
		this.correctAnswer = question.correctAnswer;
		this.showAnswerLabels = data.showAnswerLabels || true;
		console.log("Creating question with id " + id);
	}
	MultipleChoiceQuestion.prototype.show = function () {
		console.log("Showing MultipleChoiceQuestion");
	    $("#question").text(this.question.question);

	    $("#answers").empty();

	    var base = this;
	    _.each(this.question.answers, function (answer, i) {
	    	var answerLabel = base.showAnswerLabels ? String.fromCharCode(65 + i) + ") " : "";
	    	var answerText = answerLabel + answer;
	    	$("#answers").append("<div class='field'><div class='ui large radio checkbox'><input type='radio' name='questionAnswer' id='questionAnswer-" + i + "' value='" + i + "'><label for='questionAnswer-" + i + "'>" + answerText + "</label></div></div>");
	    });
	}
	MultipleChoiceQuestion.prototype.selectedAnswer = function() {
		return $("input[name=questionAnswer]:checked").val();
	};
	
	return MultipleChoiceQuestion;
});
