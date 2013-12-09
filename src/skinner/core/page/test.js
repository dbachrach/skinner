define (["require", "lib/jquery", "lib/lodash", "lib/howler", "src/skinner/core/page", "src/skinner/core/intervals", "src/skinner/core/loader", "src/skinner/core/keypath", "lib/ryaml!config/questions"], function(require, $, _, howler, Page, intervals, loader, keypath, allQuestionData) {
    "use strict";

    var states = {
        PreTest: 0,
        Test: 1,
        PostTest: 2
    };

    function applyQuestionIds(questions) {
        _.each(questions, function (question, index) {
            question.id = index.toString();
        });
    }

    var TestPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.style = keypath(this.data, "style", "multipleChoice");
            this.questionSet = keypath(this.data, "question set", {});
            this.questionsData = allQuestionData[this.questionSet];
            this.time = intervals.parseTimeInterval(keypath(this.data, "time"));
            this.order = keypath(this.data, "order");
            this.id = this.style + "-" + this.questionSet;
            // this.reportResults = this.data.reportResults || true;

            this.currentScore = 0;
            this.currentMaxScore = 0;

            applyQuestionIds(this.questionsData);

            if (this.order === "random") {
                this.questionsData = _.shuffle(this.questionsData);
            }
        },
        postShow: function () {
            console.log("Showing TestPage: " + this.style);

            // base.state = states.Test;
            this.currentQuestionIndex = 0;
            this.showQuestion();
        },
        showQuestion: function () {
            if (this.questionsData.length <= this.currentQuestionIndex) {
                console.log("Scored " + this.currentScore + " out of " + this.currentMaxScore);
                return this.moveToNextPage();
            }

            var currentQuestionData = this.questionsData[this.currentQuestionIndex];
            var currentQuestionStyle = keypath(currentQuestionData, "style", this.style);

            var base = this;
            loader.loadModule(currentQuestionStyle, "question", function (Question) {
                base.currentQuestion = new Question(currentQuestionData, currentQuestionData.id, base.data, currentQuestionStyle);
                base.currentQuestion.show();
                base.questionStartTime = _.now();
            });

            if (_.isNumber(this.time)) {
                this.timeout = setTimeout(function () {
                    base.next();
                }, this.time);
            }
        },
        next: function () {
            var questionEndTime = _.now();

            clearTimeout(this.timeout);

            var questionTime = questionEndTime - this.questionStartTime;

            var currentQuestionScore = this.currentQuestion.tallyScore();
            var currentQuestionMaxScore = this.currentQuestion.maxScore();

            function playOptionalSound(soundFile) {
                if (!_.isUndefined(soundFile)) {
                    new howler.Howl({
                        urls: ["content/sounds/" + soundFile]
                    }).play();
                }
            }

            if (this.currentQuestion.isCorrect()) {
                console.log("correct");
                playOptionalSound(this.data["correct sound"]);
            }
            else {
                console.log("incorrect");
                playOptionalSound(this.data["incorrect sound"]);
            }

            this.currentScore += currentQuestionScore;
            this.currentMaxScore += currentQuestionMaxScore;

            // if (this.reportResults) {
                this.task.subject.report(this.id, this.currentQuestion.id, "answer", this.currentQuestion.selectedAnswer());
                this.task.subject.report(this.id, this.currentQuestion.id, "correct answer", this.currentQuestion.correctAnswer());
                this.task.subject.report(this.id, this.currentQuestion.id, "score", currentQuestionScore);
                this.task.subject.report(this.id, this.currentQuestion.id, "max score", currentQuestionMaxScore);
                this.task.subject.report(this.id, this.currentQuestion.id, "time(ms)", questionTime);
                this.currentQuestion.reportResults(this.task.subject, this.id);
            // }

            this.currentQuestionIndex++;
            this.showQuestion();
        }
    });

    return TestPage;
});
