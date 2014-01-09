define (["require", "lib/jquery", "lib/lodash", "lib/howler", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", "lib/ryaml!config/questions-triangle" /* TODO: change back to config/questions */], function(require, $, _, howler, Page, loader, keyPath, allQuestionData) {
    "use strict";

    var states = {
        PreTest: 0,
        Test: 1,
        PostTest: 2
    };

    var TestPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.style = keyPath(this.data, "style", "multipleChoice");
            this.questionSet = keyPath(this.data, "question set");
            this.questionsData = allQuestionData[this.questionSet];
            this.order = keyPath(this.data, "order");
            // this.reportResults = this.data.reportResults || true;

            this.autoStartPageTimer = false;

            this.currentScore = 0;
            this.currentMaxScore = 0;

            // Assign Question Ids
            _.each(this.questionsData, function (question, index) {
                question.id = index.toString();
            });

            if (this.order === "random") {
                this.questionsData = _.shuffle(this.questionsData);
            }
        },
        id: function () {
            return this._super() + "-" + this.style + "-" + this.questionSet;
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
            var currentQuestionStyle = keyPath(currentQuestionData, "style", this.style);

            var base = this;
            loader.loadModule(currentQuestionStyle, "question", function (Question) {
                base.currentQuestion = new Question(currentQuestionData, currentQuestionData.id, base.data, currentQuestionStyle);
                base.currentQuestion.show();
                base.questionStartTime = _.now();

                base.startPageTimer();
            });
        },
        next: function () {
            this.cancelPageTimer();

            var questionEndTime = _.now();

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
                playOptionalSound(this.data["correct sound"]);
            }
            else {
                playOptionalSound(this.data["incorrect sound"]);
            }

            this.currentScore += currentQuestionScore;
            this.currentMaxScore += currentQuestionMaxScore;

            // if (this.reportResults) {
                var pageId = this.id();
                var contextId = this.currentQuestion.id;
                this.task.subject.report(pageId, contextId, "answer", this.currentQuestion.selectedAnswer());
                this.task.subject.report(pageId, contextId, "correct answer", this.currentQuestion.correctAnswer());
                this.task.subject.report(pageId, contextId, "score", currentQuestionScore);
                this.task.subject.report(pageId, contextId, "max score", currentQuestionMaxScore);
                this.task.subject.report(pageId, contextId, "time(ms)", questionTime);
                this.currentQuestion.reportResults(this.task.subject, pageId);
            // }

            this.currentQuestionIndex++;
            this.showQuestion();
        }
    });

    return TestPage;
});
