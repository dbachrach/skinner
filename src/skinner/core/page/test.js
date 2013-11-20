define (["require", "underscore", "yaml", "src/tri/core/intervals", "src/tri/core/tri"], function(require, _, YAML, intervals, tri) {
	"use strict";

	function applyQuestionIds(questions) {
		_.each(questions, function (question, index) {
			question.id = index.toString();
		});
	}

	function TestPage(data, task) {
		var questionData = YAML.load("config/questions.yaml");

		this.style = data.style;
		this.questionSet = data["question set"];
		this.questions = questionData[this.questionSet];
		this.time = intervals.parseTimeInterval(data.time);
		this.order = data.order;
		this.data = data;
		this.task = task;
		this.id = this.style + "-" + this.questionSet;

		applyQuestionIds(this.questions);
		console.log("questions");console.log(this.questions);

		if (this.order === "random") {
			this.questions = _.shuffle(this.questions);
		}
	}
	TestPage.prototype.show = function () {
		console.log("Showing TestPage: " + this.style);

		var base = this;
		tri.loadLayout(this.style, "question", this.data, "#test", function () {
			base.currentQuestionIndex = 0;
			base.showQuestion();
		});	
	};
	TestPage.prototype.showQuestion = function () {

		if (this.questions.length <= this.currentQuestionIndex) {
			return this.end();
		}

		var base = this;
		tri.loadModule(this.style, "question", function (Question) {
			base.currentQuestion = new Question(base.questions[base.currentQuestionIndex], base.questions[base.currentQuestionIndex].id, base.data);
			base.currentQuestion.show();
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
		clearTimeout(this.timeout);

		console.log("TestPage::next()");
		if (_.isFunction(this.currentQuestion.reportAnswer)) {
			this.currentQuestion.reportAnswer(this.id, this.trial.subject, this);
		}
		else {
			console.log("Recording response for question: " +  this.currentQuestion.selectedAnswer());
			console.log(this.task);
			this.task.subject.report(this.id, this.currentQuestion.id, this.currentQuestion.selectedAnswer());
		}

		this.currentQuestionIndex++;
		this.showQuestion();
	}

	return TestPage;
});
