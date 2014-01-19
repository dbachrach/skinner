define(function (require) {
    var Question = require("src/skinner/core/question");

    module("skinner/core/question");

    test("question - Defaults", function () {
        var q = new Question();
        ok(q);

        equal(q.caseSensitiveScoring, false);
    });

    test("question - Initialization (with '*' answer)", function () {
        var answer1 = "an answer";
        var questionData = { "answers": [answer1 + "*"] };
        var q = new Question(questionData);
        deepEqual(q.data.answers, [answer1]);
    });

    test("question - Initialization (with ' *' answer)", function () {
        var answer1 = "an answer";
        var questionData = { "answers": [answer1 + " *"] };
        var q = new Question(questionData);
        deepEqual(q.data.answers, [answer1]);
    });

    test("question - Initialization (with lots of spaces in answer)", function () {
        var answer1 = "an answer";
        var questionData = { "answers": ["   " + answer1 + "                "] };
        var q = new Question(questionData);
        deepEqual(q.data.answers, [answer1]);
    });

    test("qustion - correctAnswers()", function () {
        var correctAnswer = "Answer1";
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        deepEqual(q.correctAnswers(), [correctAnswer]);
    });

    test("qustion - isCorrect() - string answers", function () {
        var correctAnswer = "Answer1";
        var incorrectAnswer = "Answer2";
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return correctAnswer;
        }
        equal(q.isCorrect(), true);

        q.selectedAnswer = function () {
            return incorrectAnswer;
        }
        equal(q.isCorrect(), false);
    });

    test("qustion - isCorrect() - number answers", function () {
        var correctAnswer = 25;
        var incorrectAnswer = 2.5;
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return correctAnswer;
        }
        equal(q.isCorrect(), true);

        q.selectedAnswer = function () {
            return incorrectAnswer;
        }
        equal(q.isCorrect(), false);
    });

    test("qustion - isCorrect() - mixed answers", function () {
        var correctAnswer = 25;
        var stringifiedCorrectAnswer = "25";
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return correctAnswer;
        }
        equal(q.isCorrect(), true);

        q.selectedAnswer = function () {
            return stringifiedCorrectAnswer;
        }
        equal(q.isCorrect(), true);
    });

    test("qustion - isCorrect() - undefined answers", function () {
        var correctAnswer = undefined;
        var stringifiedCorrectAnswer = "Answer1";
        var questionData = { "answers": [] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return correctAnswer;
        }
        equal(q.isCorrect(), false); // undefined selected answer, is still false

        q.selectedAnswer = function () {
            return stringifiedCorrectAnswer;
        }
        equal(q.isCorrect(), false);
    });

    test("qustion - isCorrect() - case sensitivity", function () {
        var correctAnswer = "ANSWER1";
        var differentCaseCorrectAnswer = "Answer1";
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return differentCaseCorrectAnswer;
        }
        equal(q.isCorrect(), true, "Case insensitive");

        q.caseSensitiveScoring = true;
        equal(q.isCorrect(), false, "Case sensitive");
    });

    test("qustion - tallyScore()", function () {
        var correctAnswer = "ANSWER1";
        var incorrectAnswer = "wrong answer";
        var questionData = { "answers": [correctAnswer + " *"] };
        var q = new Question(questionData);
        q.selectedAnswer = function () {
            return correctAnswer;
        }
        equal(q.tallyScore(), 1, "Correct answer");

        q.selectedAnswer = function () {
            return incorrectAnswer;
        }
        equal(q.tallyScore(), 0, "Incorrect answer");
    });

    test("qustion - maxScore()", function () {
        var q = new Question();
        deepEqual(q.maxScore(), 1);
    });
});
