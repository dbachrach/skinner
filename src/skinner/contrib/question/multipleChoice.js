define(["jquery", "src/skinner/core/question", "Handlebars"], function($, Question, Handlebars) {
	"use strict";

	var MultipleChoiceQuestion = Question.extend({
		init: function (data, id, testData, style) {
			this._super(data, id, testData, style);

			// Create an `answerLabel` handlebars helper.
			// Takes the loop index (`@index`) and turns it into an answer label.
			// Example: `{{answerLabel 0 }}` -> `"A) "`.
			//          `{{answerLabel 2 }}` -> `"C) "`.
			Handlebars.registerHelper('answerLabel', function(index) {
              return String.fromCharCode(65 + index) + ") ";
            });
		},
		selectedAnswer: function() {
			return $("input[name=questionAnswer]:checked").val();
		}
	});
	
	return MultipleChoiceQuestion;
});
