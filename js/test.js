
var Test = function(style, questions, time, order, finishHandler) {
	this.style = style;
	this.questions = questions;
	this.time = ParseTime(time);
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

var TriangleQuestion = function(question) {
	this.question = question;
}
TriangleQuestion.prototype.show = function() {
	console.log("Showing TriangleQuestion");
    $("#question").text(this.question.question);

    var canvas = $("#questionCanvas");
    var qboard = this.buildBoard(canvas);
	qboard.redraw();
}

TriangleQuestion.prototype.buildBoard = function(canvas) {
    var edge = 400.0;
    var xOffset = (600 - edge) / 2;
    var yOffset = 50.0;

    var triangleHeight = Math.sqrt((Math.pow(edge, 2) - (Math.pow(edge / 2, 2))));

    var a = new Point(xOffset + (edge / 2), yOffset, "rgb(255,0,0)");
    var b = new Point(xOffset, yOffset + triangleHeight, "rgb(255,255,0)");
    var c = new Point(b.x + edge, b.y, "rgb(0,0,255)")

    var center = new Point(a.x, b.y - (Math.tan(Math.PI / 6) * (edge/2)));

    var aCircle = new Circle(a);
    aCircle.addLabel(this.question["answers"][0], LabelLocation.ABOVE);
    var bCircle = new Circle(b);
    bCircle.addLabel(this.question["answers"][1], LabelLocation.BELOW);
    var cCircle = new Circle(c);
    cCircle.addLabel(this.question["answers"][2], LabelLocation.BELOW);

    var centerCircle = new Circle(center);
    centerCircle.addLabel("Don't know", LabelLocation.BELOW);

    var qboard = new QuestionBoard(canvas);
    qboard.addElement(new Triangle(a, b, c))
    qboard.addElements([aCircle, bCircle, cCircle, centerCircle]);
    qboard.addElements(GenerateCirclesBetweenPoints(a, b));
    qboard.addElements(GenerateCirclesBetweenPoints(b, c));
    qboard.addElements(GenerateCirclesBetweenPoints(c, a));
    return qboard;
}
