define (["require", "jquery", "underscore", "src/skinner/core/page", "src/skinner/core/intervals", "src/skinner/core/loader", "ryaml!config/questions"], function(require, $, _, Page, intervals, loader, questionData) {
    "use strict";

    var states = {
        PreTest: 0,
        Test: 1,
        PostTest: 2
    }

    function applyQuestionIds(questions) {
        _.each(questions, function (question, index) {
            question.id = index.toString();
        });
    }

    var TestPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.style = this.data.style || "multipleChoice";
            this.questionSet = this.data["question set"];
            this.questions = questionData[this.questionSet];
            this.time = intervals.parseTimeInterval(data.time);
            this.order = this.data.order;
            this.id = this.style + "-" + this.questionSet;
            this.reportResults = this.data.reportResults || true;
            this.currentScore = 0;
            this.currentMaxScore = 0;

            applyQuestionIds(this.questions);

            if (this.order === "random") {
                this.questions = _.shuffle(this.questions);
            }
        },
        postShow: function () {
            console.log("Showing TestPage: " + this.style);

            // base.state = states.Test;
            this.currentQuestionIndex = 0;
            this.showQuestion();
        },
        showQuestion: function () {
            if (this.questions.length <= this.currentQuestionIndex) {
                console.log("Scored " + this.currentScore + " out of " + this.currentMaxScore);
                return this.moveToNextPage();
            }

            var base = this;
            loader.loadModule(this.style, "question", function (Question) {
                base.currentQuestion = new Question(base.questions[base.currentQuestionIndex], base.questions[base.currentQuestionIndex].id, base.data, base.style);
                base.currentQuestion.show();
                base.questionStartTime = $.now();
            });

            if (_.isNumber(this.time)) {
                this.timeout = setTimeout(function () {
                    base.next();
                }, this.time);
            }
        },
        next: function () {
            var questionEndTime = $.now();

            clearTimeout(this.timeout);

            var questionTime = questionEndTime - this.questionStartTime;

            var currentQuestionScore = this.currentQuestion.tallyScore();
            var currentQuestionMaxScore = this.currentQuestion.maxScore();

            this.currentScore += currentQuestionScore;
            this.currentMaxScore += currentQuestionMaxScore;

            if (this.reportResults) {
                this.task.subject.report(this.id, this.currentQuestion.id, "answer", this.currentQuestion.selectedAnswer());
                this.task.subject.report(this.id, this.currentQuestion.id, "correct answer", this.currentQuestion.correctAnswer());
                this.task.subject.report(this.id, this.currentQuestion.id, "score", currentQuestionScore);
                this.task.subject.report(this.id, this.currentQuestion.id, "max score", currentQuestionMaxScore);
                this.task.subject.report(this.id, this.currentQuestion.id, "time(ms)", questionTime);
                this.currentQuestion.reportResults(this.task.subject, this.id)
            }

            this.currentQuestionIndex++;
            this.showQuestion();
        }
    });
    
    return TestPage;
});
