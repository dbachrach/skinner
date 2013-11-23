define (["require", "jquery", "underscore", "src/skinner/core/intervals", "src/skinner/core/skinner", "ryaml!config/questions"], function(require, $, _, intervals, skinner, questionData) {
	"use strict";

	function applyQuestionIds(questions) {
		_.each(questions, function (question, index) {
			question.id = index.toString();
		});
	}

	function TestPage(data, task) {
		if (_.isUndefined(data)) {
			data = {};
		}
		this.style = data.style || "multipleChoice";
		this.questionSet = data["question set"];
		this.questions = questionData[this.questionSet];
		this.time = intervals.parseTimeInterval(data.time);
		this.order = data.order;
		this.data = data;
		this.task = task;
		this.id = this.style + "-" + this.questionSet;
		this.currentScore = 0;

		applyQuestionIds(this.questions);
		console.log("questions");console.log(this.questions);

		if (this.order === "random") {
			this.questions = _.shuffle(this.questions);
		}
	}
	TestPage.prototype.show = function () {
		console.log("Showing TestPage: " + this.style);

		var base = this;
		skinner.loadLayout(this.style, "question", this.data, "#test", function () {
			base.currentQuestionIndex = 0;
			base.showQuestion();
		});	
	};
	TestPage.prototype.showQuestion = function () {

		if (this.questions.length <= this.currentQuestionIndex) {
			return this.end();
		}

		var base = this;
		skinner.loadModule(this.style, "question", function (Question) {
			base.currentQuestion = new Question(base.questions[base.currentQuestionIndex], base.questions[base.currentQuestionIndex].id, base.data);
			console.log("created new question"); console.log(base.currentQuestion);
			console.log("id craeted: " + base.questions[base.currentQuestionIndex].id);
			base.currentQuestion.show();
			base.questionStartTime = $.now();
		});

		if (_.isNumber(this.time)) {
			this.timeout = setTimeout(function () {
				base.next();
			}, this.time);
		}
	};
	TestPage.prototype.end = function () {
		console.log("TestPage.end()");
        this.task.nextPage();
    };

	TestPage.prototype.next = function () {
		var questionEndTime = $.now();

		clearTimeout(this.timeout);

		var questionTime = questionEndTime - this.questionStartTime;


		var currentQuestionScore = this.calculateCurrentQuestionScore();

		this.currentScore += currentQuestionScore;

		console.log("TestPage::next()");
		if (_.isFunction(this.currentQuestion.reportAnswer)) {
			this.currentQuestion.reportAnswer(this.id, this.trial.subject, this, questionTime);
		}
		else {
			console.log("Recording response for question: " +  this.currentQuestion.selectedAnswer());
			console.log(this.task);
			this.task.subject.report(this.id, this.currentQuestion.id, "answer", this.currentQuestion.selectedAnswer());
			this.task.subject.report(this.id, this.currentQuestion.id, "score", currentQuestionScore);
			this.task.subject.report(this.id, this.currentQuestion.id, "time(ms)", questionTime);
			this.task.subject.report(this.id, this.currentQuestion.id, "correct answer", this.currentQuestion.correctAnswer);
		}

		this.currentQuestionIndex++;
		this.showQuestion();
	}
	TestPage.prototype.calculateCurrentQuestionScore = function() {
		var score = undefined;
		var question = this.currentQuestion;
		if (_.isFunction(question.tallyScore)) {
			score = question.tallyScore();
		}
		else {
			if (question.selectedAnswer() === question.correctAnswer) {
				score = 1;
			}
			else {
				score = 0;
			}
		}
		return score;
	};

	return TestPage;
});
