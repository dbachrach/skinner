define (["jquery", "underscore", "app/helpers"], function(jquery, underscore, helpers) {
	"use strict";

	var Test = function(style, questions, time, order, finishHandler) {
		console.log("Creating test");
		this.style = style;
		this.questions = questions;
		this.time = helpers.ParseTime(time);
		this.order = order;
		this.finishHandler = finishHandler;
	}

	Test.prototype.begin = function() {
		if (this.order === "random") {
			this.questions = _.shuffle(this.questions);
		}

		this.currentQuestion = 0;
		this.showQuestion();
	};
	Test.prototype.showQuestion = function() {

		if (this.questions.length <= this.currentQuestion) {
			return this.end();
		}

		var base = this;
		require(["app/" + this.style + "Question"], function (Question) {
			var question = new Question(base.questions[base.currentQuestion]);
			question.show();
		});

		var base = this;
		setTimeout(function() { 
			base.currentQuestion++;
			base.showQuestion();
		}, this.time);
	};
	Test.prototype.end = function() {
		console.log("Triangle test finished");
		this.finishHandler();
	}

	return Test;
});
