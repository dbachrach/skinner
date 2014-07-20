
// TODO: This is really defined in the mode module. figure out how to get this double require level
function isTestMode() {
    var search = window.location.search;
    var matches = search.match(/test=([^&]*)&*/);
    if (matches && matches.length == 2) {
        if (matches[1] === "true") {
            return true;
        }
    }
    return false;
}

var questionsFile = "ryaml!config/questions";
if (isTestMode()) {
    var search = window.location.search;
    var matches = search.match(/questions=([^&]*)&*/);
    if (matches && matches.length === 2) {
        questionsFile = "ryaml!tests/functional/configs/" + matches[1];
    }
}

define (["lib/jquery", "lib/lodash", "lib/howler", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", questionsFile, "peg!src/skinner/core/parser/selectStatement"], function ($, _, howler, Page, loader, keyPath, allQuestionData, SelectStatementParser) {
    "use strict";

    var States = {
        PreTest: 0,
        Test: 1,
        InlineTest: 2,
        PostTest: 3,
        ShowTestScore: 4,
        Exit: 5
    };

    function isQuestionGrouped(question) {
        var questionGroup = keyPath(question, "question group");
        return (!_.isUndefined(questionGroup));
    }

    var allQuestionsDataRemovedTracker = _.cloneDeep(allQuestionData);

    var TestPage = Page.extend({
        init: function (data, task) {
            var base = this;

            this._super(data, task);

            this.style = keyPath(this.data, "style", "multipleChoice");
            this.questionSet = keyPath(this.data, "question set");
            this.questionsData = allQuestionData[this.questionSet];
            this.questionsDataRemovedTracker = allQuestionsDataRemovedTracker[this.questionSet];
            this.order = keyPath(this.data, "order");
            this.requireCorrectAnswer = keyPath(this.data, "require correct answer", false);
            this.select = undefined;

            var selectStatement = keyPath(this.data, "select");
            if (!_.isUndefined(selectStatement)) {
                var select = SelectStatementParser.parse(selectStatement);
                if (!_.isUndefined(select)) {
                    this.select = select;
                }
            }

            this.autoStartPageTimer = false;

            this.currentScore = 0;
            this.currentMaxScore = 0;

            this.testPerformsScoring = false;

            var totalQuestionList;

            if (_.isUndefined(this.select)) {
                // Assign Question Ids
                var flattenedQuestions = _.flatten(_.map(this.questionsData, function (q) {
                    if (isQuestionGrouped(q)) {
                        return keyPath(q, "questions", []);
                    }
                    else {
                        return q;
                    }
                }));

                totalQuestionList = flattenedQuestions;
            }
            else {

                console.log("select statement:");
                console.log(this.select);
                console.log("question data:");
                console.log(_.cloneDeep(this.questionsData));

                var allQuestions = [];

                _.each(this.select, function (selector) {
                    // TODO: Support the "each topic" topics value
                    _.each(selector.topics, function (topic) {
                        console.log("investigating topic " + topic);
                        if (_.isNumber(selector.times)) {
                            _.each(_.range(selector.times), function (occurence) {
                                var topicData = base.questionsData[topic];

                                var question = _.sample(topicData);

                                question.__topic = topic;

                                var strippedQuestion = _.omit(question, ["__topic", "__topicId"]);
                                question.__topicId = _.findIndex(base.questionsDataRemovedTracker[topic], strippedQuestion) + 1;

                                console.log("Picked question from " + topic + " time no. " + occurence);
                                console.log(question);

                                allQuestions.push(question);

                                base.questionsData[topic] = _.without(topicData, question);
                            });
                        }
                        else if (selector.times === "all") {
                            var topicData = base.questionsData[topic];

                            _.each(topicData, function (q) {
                                q.__topic = topic;

                                var strippedQuestion = _.omit(q, ["__topic", "__topicId"]);
                                q.__topicId = _.findIndex(base.questionsDataRemovedTracker[topic], strippedQuestion) + 1;
                            });

                            console.log("picked all questions from " + topic);
                            console.log(topicData);
                            allQuestions = allQuestions.concat(topicData);

                            base.questionsData[topic] = [];
                        }
                    });
                });

                totalQuestionList = allQuestions;

                console.log("Total question list is:");
                console.log(totalQuestionList);
                console.log("Leaving behind questionsData:");
                console.log(this.questionsData);
            }

            _.each(totalQuestionList, function (q, index) {
                var displayIndex = index + 1;
                q.id = displayIndex.toString();
            });

            // TODO: Support randomizng inside a question group too
            if (this.order === "random") {
                this.questionsData = _.shuffle(totalQuestionList);
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
                if (keyPath(this.data, "inline", false)) {
                    this.state = States.InlineTest;
                    this.hasStartedInlineTest = false;
                }
                else {
                    this.state = States.Test;
                    this.currentQuestionIndex = -1;
                }

                this.nextState();
            }
            else if (this.state === States.Test) {
                this.currentQuestionIndex++;

                if (this.questionsData.length > this.currentQuestionIndex) {
                    this.showSingleQuestion(this.questionsData[this.currentQuestionIndex]);
                }
                else {
                    this.state = States.PostTest;
                    this.nextState();
                }
            }
            else if (this.state === States.InlineTest) {
                if (!this.hasStartedInlineTest) {
                    this.showAllQuestions();
                    this.hasStartedInlineTest = true;
                }
                else {
                    this.state = States.PostTest;
                    this.nextState();
                }
            }
            else if (this.state === States.PostTest) {
                this.onPostTest();

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
        showQuestion: function (q, where, callback) {
            var base = this;

            var questionStyle = keyPath(q, "style", this.style);

            if (isQuestionGrouped(q)) {
                loader.loadModule(questionStyle, "question", function (Question) {
                    q.grouped = true;
                    var question = new Question(q, null, base.data, questionStyle);
                    question.show(where);
                    callback(question);
                });
            }
            else {
                loader.loadModule(questionStyle, "question", function (Question) {
                    var question = new Question(q, q.id, base.data, questionStyle);
                    question.show(where);
                    callback(question);
                });
            }
        },
        showSingleQuestion: function (q) {
            var base = this;
            this.showQuestion(q, "#test", function (question) {
                base.currentQuestion = question;
                base.startPageTimer();
                base.questionStartTime = _.now();
            });
        },
        showAllQuestions: function () {
            var base = this;

            this.currentQuestions = [];

            $("#test").addClass("inline");

            _.each(this.questionsData, function (q, index) {
                var elementId = "test_question_" + q.id;
                $("<div/>", {
                    id: elementId,
                    class: "inline_question"
                }).appendTo("#test");

                base.showQuestion(q, "#" + elementId, function (question) {
                    base.currentQuestions[index] = question;
                });
            });

            // TODO: Can we get this to start after all questions have done their callbacks?
            this.startPageTimer();
            this.questionStartTime = _.now();
        },
        showTestScore: function () {
            // TODO: These should be exposed in experiment.yaml
            var bindings = {
                title: "Practice Test Score",
                content: "<p>Your score: <strong>" + this.currentScore + "</strong></p><p>Max score: <strong>" + this.currentMaxScore + "</strong></p>"
            };
            loader.loadLayoutInPackage("testresults", "src/skinner/core/", bindings, "#test");

            // TODO: This is a super hack!!!!!
             _.extend(this.data, { "next": { "button": "Next" } });
            this.updateButtons();
        },
        onPostTest: function () {
            if (this.testPerformsScoring) {
                var pageId = this.id();
                var contextId = "final";
                this.task.subject.report(pageId, contextId, "final score", this.currentScore);
                this.task.subject.report(pageId, contextId, "final max score", this.currentMaxScore);
            }
        },
        next: function () {
            var base = this;
            function playOptionalSound(soundFile) {
                if (!_.isUndefined(soundFile)) {
                    new howler.Howl({
                        urls: ["content/sounds/" + soundFile]
                    }).play();
                }
            }

            var pageId = this.id();
            var questionEndTime = _.now();
            var questionTime = questionEndTime - this.questionStartTime;

            var reportResponseTime = keyPath(this.data, "report.response time", true);

            // TODO: This can use a lot of refactoring!!. lots of repetition
            if (this.state === States.InlineTest) {
                this.cancelPageTimer();
                _.each(this.currentQuestions, function (question) {
                    if (keyPath(question.data, "grouped", false)) {
                        if (keyPath(base.data, "report results", true)) {
                            question.reportResults(base.task.subject, pageId);
                            question.reportGroupedResults(base.task.subject, pageId);
                        }
                    }
                    else {
                        var isCorrect = question.isCorrect();

                        var performsScoring = question.performsScoring();
                        var currentQuestionScore = 0;
                        var currentQuestionMaxScore = 0;
                        if (performsScoring) {
                            this.testPerformsScoring = true;
                            currentQuestionScore = question.tallyScore();
                            currentQuestionMaxScore = question.maxScore();

                            base.currentScore += currentQuestionScore;
                            base.currentMaxScore += currentQuestionMaxScore;
                        }

                        if (keyPath(base.data, "report results", true)) {
                            var contextId = question.id;
                            base.task.subject.report(pageId, contextId, "answer", question.selectedAnswer());
                            if (!_.isEmpty(question.correctAnswers())) {
                                base.task.subject.report(pageId, contextId, "correct answer", question.correctAnswers());
                            }
                            if (performsScoring) {
                                base.task.subject.report(pageId, contextId, "score", currentQuestionScore);
                                base.task.subject.report(pageId, contextId, "max score", currentQuestionMaxScore);
                            }
                            if (reportResponseTime) {
                                base.task.subject.report(pageId, contextId, "time(ms)", questionTime);
                            }

                            if (!_.isUndefined(question.data.__topic)) {
                                base.task.subject.report(pageId, contextId, "topic", question.data.__topic);
                            }
                            if (!_.isUndefined(question.data.__topicId)) {
                                base.task.subject.report(pageId, contextId, "topic id", question.data.__topicId);
                            }
                            question.reportResults(base.task.subject, pageId);
                        }
                    }
                });
            }
            else if (this.state === States.Test) {
                this.cancelPageTimer();
                if (keyPath(this.currentQuestion.data, "grouped", false)) {
                    if (keyPath(this.data, "report results", true)) {
                        this.currentQuestion.reportResults(this.task.subject, pageId);
                        this.currentQuestion.reportGroupedResults(this.task.subject, pageId);
                    }
                }
                else {
                    var incorrectMessageId = "__incorrectAnswerMessage";

                    $("#" + incorrectMessageId).remove();

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

                    if (isCorrect) {
                        playOptionalSound(this.data["correct sound"]);
                    }
                    else {
                        playOptionalSound(this.data["incorrect sound"]);
                    }

                    var performsScoring = this.currentQuestion.performsScoring();
                    var currentQuestionScore = 0;
                    var currentQuestionMaxScore = 0;
                    if (performsScoring) {
                        this.testPerformsScoring = true;
                        currentQuestionScore = this.currentQuestion.tallyScore();
                        currentQuestionMaxScore = this.currentQuestion.maxScore();

                        this.currentScore += currentQuestionScore;
                        this.currentMaxScore += currentQuestionMaxScore;
                    }

                    if (keyPath(this.data, "report results", true)) {
                        var contextId = this.currentQuestion.id;
                        this.task.subject.report(pageId, contextId, "answer", this.currentQuestion.selectedAnswer());
                        if (!_.isEmpty(this.currentQuestion.correctAnswers())) {
                            this.task.subject.report(pageId, contextId, "correct answer", this.currentQuestion.correctAnswers());
                        }
                        if (performsScoring) {
                            this.task.subject.report(pageId, contextId, "score", currentQuestionScore);
                            this.task.subject.report(pageId, contextId, "max score", currentQuestionMaxScore);
                        }
                        if (reportResponseTime) {
                            this.task.subject.report(pageId, contextId, "time(ms)", questionTime);
                        }

                        if (!_.isUndefined(this.currentQuestion.data.__topic)) {
                            this.task.subject.report(pageId, contextId, "topic", this.currentQuestion.data.__topic);
                        }
                        if (!_.isUndefined(this.currentQuestion.data.__topicId)) {
                            this.task.subject.report(pageId, contextId, "topic id", this.currentQuestion.data.__topicId);
                        }
                        this.currentQuestion.reportResults(this.task.subject, pageId);
                    }
                }
            }

            this.nextState();
        }
    });

    return TestPage;
});
