define (["require", "underscore", "yaml", "core/helpers", "core/tri"], function(require, _, yaml, helpers, tri) {
	"use strict";

	function TestPage(data, experiment) {
		var questionData = YAML.load("config/questions.yaml");

		this.style = data.style;
		this.questions = questionData[data.questionSet];
		console.log(this.questions);
		console.log(data);
		this.time = helpers.ParseTime(data.time);
		this.order = data.order;
		this.data = data;
		this.experiment = experiment;

		if (this.order === "random") {
			this.questions = _.shuffle(this.questions);
		}
	}
	TestPage.prototype.show = function () {
		console.log("Showing TestPage: " + this.style);
		
		var base = this;
		helpers.LoadLayout("test_" + this.style, [], this.data, this.experiment, function() {
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
			base.currentQuestion = new Question(base.questions[base.currentQuestionIndex], base.data);
			base.currentQuestion.show();
		});

		if (_.isNumber(this.time)) {
			this.timeout = setTimeout(function () {
				base.next();
			}, this.time);
		}
	};
	TestPage.prototype.end = function () {
        this.experiment.nextPage();
    };

	TestPage.prototype.next = function () {
		clearTimeout(this.timeout);

		console.log("Recording response for question: " +  this.currentQuestion.selectedAnswer());
		// subject.record(this.currentQuestion.question, this.currentQuestion.selectedAnswer());

		this.currentQuestionIndex++;
		this.showQuestion();
	}

	return TestPage;
});
