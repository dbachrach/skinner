define (["lib/jquery", "lib/lodash", "lib/howler", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", "lib/ryaml!config/questions"], function($, _, howler, Page, loader, keyPath, allQuestionData) {
    "use strict";

    var States = {
        PreTest: 0,
        Test: 1,
        PostTest: 2,
        ShowTestScore: 3,
        Exit: 4
    };

    var TestPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.style = keyPath(this.data, "style", "multipleChoice");
            this.questionSet = keyPath(this.data, "question set");
            this.questionsData = allQuestionData[this.questionSet];
            this.order = keyPath(this.data, "order");
            this.requireCorrectAnswer = keyPath(this.data, "require correct answer", false);

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

            this.state = States.PreTest;
        },
        id: function () {
            return this._super() + "-" + this.style + "-" + this.questionSet;
        },
        postShow: function () {
            console.log("Showing TestPage: " + this.style);

            this.nextState();
        },
        nextState: function () {
            if (this.state === States.PreTest) {
                this.state = States.Test;
                this.currentQuestionIndex = -1;
                this.nextState();
            }
            else if (this.state === States.Test) {
                this.currentQuestionIndex++;

                if (this.questionsData.length > this.currentQuestionIndex) {
                    this.showQuestion();
                }
                else {
                    this.state = States.PostTest;
                    this.nextState();
                }
            }
            else if (this.state === States.PostTest) {
                if (keyPath(this.data, "show test results") === "on completion") {
                    this.state = States.ShowTestScore;
                    this.showTestScore();
                }
                else {
                    this.state = States.Exit;
                    this.nextState();
                }
            }
            else if (this.state === States.ShowTestScore) {
                this.state = States.Exit;
                this.nextState();
            }
            else if (this.state === States.Exit) {
                this.moveToNextPage();
            }
        },
        showQuestion: function () {
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
        showTestScore: function() {
            // TODO: These should be exposed in experiment.yaml
            var bindings = {
                "title" : "Practice Test Score",
                "content" : "<p>Your score: <strong>" + this.currentScore + "</strong></p><p>Max score: <strong>" + this.currentMaxScore + "</strong></p>"
            };
            loader.loadLayoutInPackage("testresults", "src/skinner/core/", bindings, "#test");
        },
        next: function () {
            function playOptionalSound(soundFile) {
                if (!_.isUndefined(soundFile)) {
                    new howler.Howl({
                        urls: ["content/sounds/" + soundFile]
                    }).play();
                }
            }

            console.log("in next: with state===" + this.state);
            if (this.state === States.Test) {
                console.log("in next: with state===test");
                var incorrectMessageId = "__incorrectAnswerMessage";

                $("#" + "__incorrectAnswerMessage").remove();

                var isCorrect = this.currentQuestion.isCorrect();

                if (this.requireCorrectAnswer && !isCorrect) {
                    var incorrectMessage = keyPath(this.data, "incorrect answer message", "Incorrect");
                    // Show incorrect answer message.
                    $("<div/>", {
                        id: incorrectMessageId,
                        class: "ui red message",
                        text: incorrectMessage
                    }).appendTo("#test");
                    return;
                }

                this.cancelPageTimer();

                var questionEndTime = _.now();

                var questionTime = questionEndTime - this.questionStartTime;

                var currentQuestionScore = this.currentQuestion.tallyScore();
                var currentQuestionMaxScore = this.currentQuestion.maxScore();

                if (isCorrect) {
                    playOptionalSound(this.data["correct sound"]);
                }
                else {
                    playOptionalSound(this.data["incorrect sound"]);
                }

                this.currentScore += currentQuestionScore;
                this.currentMaxScore += currentQuestionMaxScore;

                if (keyPath(this.data, "report results", true)) {
                    var pageId = this.id();
                    var contextId = this.currentQuestion.id;
                    this.task.subject.report(pageId, contextId, "answer", this.currentQuestion.selectedAnswer());
                    this.task.subject.report(pageId, contextId, "correct answer", this.currentQuestion.correctAnswers());
                    this.task.subject.report(pageId, contextId, "score", currentQuestionScore);
                    this.task.subject.report(pageId, contextId, "max score", currentQuestionMaxScore);
                    this.task.subject.report(pageId, contextId, "time(ms)", questionTime);
                    this.currentQuestion.reportResults(this.task.subject, pageId);
                }
            }

            this.nextState();
        }
    });

    return TestPage;
});
