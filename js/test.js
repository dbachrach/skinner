
var TriangleTest = function(questions, time, order, finishHandler) {
	this.questions = questions;
	this.time = time;
	this.order = order;
	this.finishHandler = finishHandler;
}

TriangleTest.prototype.begin = function() {
	if (this.order === "random") {
		this.questions = _.shuffle(this.questions);
	}

	this.currentQuestion = 0;
	this.showQuestion();
};
TriangleTest.prototype.showQuestion = function() {

	if (this.questions.length <= this.currentQuestion) {
		return this.end();
	}

	var question = new TriangleQuestion(this.questions[this.currentQuestion]);
	question.show();

	var base = this;
	setTimeout(function() { 
		base.currentQuestion++;
		base.showQuestion();
	}, this.time * 1000);
};
TriangleTest.prototype.end = function() {
	console.log("Triangle test finished");
	this.finishHandler();
}

var TriangleQuestion = function(question) {
	this.question = question;
}
TriangleQuestion.prototype.show = function() {
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
    aCircle.addLabel(this.question["answers"]["a"], LabelLocation.ABOVE);
    var bCircle = new Circle(b);
    bCircle.addLabel(this.question["answers"]["b"], LabelLocation.BELOW);
    var cCircle = new Circle(c);
    cCircle.addLabel(this.question["answers"]["c"], LabelLocation.BELOW);

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
