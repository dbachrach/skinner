define (["jquery", "underscore", "app/helpers", "app/trianglequestion"], function(j, u, helpers, TriangleQuestion) {
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

		var question;
		if (this.style === "triangle") {
			question = new TriangleQuestion(this.questions[this.currentQuestion]);
		}
		else if (this.style === "multipleChoice") {
			question = new MultipleChoiceQuestion(this.questions[this.currentQuestion]);
		}
		question.show();

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

	var MultipleChoiceQuestion = function(question) {
		this.question = question;
	}
	MultipleChoiceQuestion.prototype.show = function() {
		console.log("Showing MultipleChoiceQuestion");
	    $("#question").text(this.question.question);

	    $("#answers").empty();

	    _.each(this.question.answers, function (answer, i) {
	    	var answerText = String.fromCharCode(65 + i) + ") " + answer;
	    	$("#answers").append("<input type='radio' name='questionAnswer' id='questionAnswer-" + i + "' /><label for='questionAnswer-" + i + "'>" + answerText + "</label>");

	    });
	}
	
	return Test;
});
