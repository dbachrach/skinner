define(["jquery", "src/skinner/core/question", "levenshtein"], function($, Question, Levenshtein) {
	"use strict";

    // ## CuedRecallQuestion

	var CuedRecallQuestion = Question.extend({
		init: function (data, id, testData, style) {
			this._super(data, id, testData, style);
		},
		postShow: function () {
			// After loading the page, put the cursor focus
			// on the answer text box.
			$("#cuedRecallAnswer").focus();
		},
		selectedAnswer: function() {
			// Return the answer text box's value.
			return $("#cuedRecallAnswer").val();
		},
		reportResults: function (subject, testId) {
            var levenshtein = new Levenshtein($("#cuedRecallAnswer").val(), this.correctAnswer());
            subject.report(testId, this.id, "Spelling Distance", levenshtein.distance);
        }
	});
	
	return CuedRecallQuestion;
});
