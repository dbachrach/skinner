var question = "Whose studies of bodies in motion lent support to the heliocentric model of the solar system?";
var answerA = "Galileo";
var answerB = "Kepler";
var answerC = "Newton";

var unselectedColor = "white";

$("#question").text(question);

var canvas = $("#questionCanvas");
var canvasEl = canvas[0];
var ctx = canvasEl.getContext('2d');

var canvasWidth = canvasEl.width;
var canvasHeight = canvasEl.height;

canvas.click(function (e) {
    var p = getCursorPosition(e);
    var circle = qboard.hitTest(p);
    if (circle) {
    	qboard.deselectAll();
    	circle.clicked();
    }
    qboard.redraw();
});

canvas.mousemove(function (e) {
    var p = getCursorPosition(e);
    var circle = qboard.hitTest(p);
    qboard.unhighlightAll();
    if (circle) {
    	circle.highlight();
        canvas.css("cursor", "pointer");
    }
    else {
        canvas.css("cursor", "default");
    }
    qboard.redraw();
});


var buildBoard = function() {
    var edge = 400.0;
    var xOffset = (canvasWidth - edge) / 2;
    var yOffset = 50.0;

    var triangleHeight = Math.sqrt((Math.pow(edge, 2) - (Math.pow(edge / 2, 2))));

    var a = new Point(xOffset + (edge / 2), yOffset, "rgb(255,0,0)");
    var b = new Point(xOffset, yOffset + triangleHeight, "rgb(255,255,0)");
    var c = new Point(b.x + edge, b.y, "rgb(0,0,255)")

    var center = new Point(a.x, b.y - (Math.tan(Math.PI / 6) * (edge/2)));

    var aCircle = new Circle(a);
    aCircle.addLabel(answerA, LabelLocation.ABOVE);
    var bCircle = new Circle(b);
    bCircle.addLabel(answerB, LabelLocation.BELOW);
    var cCircle = new Circle(c);
    cCircle.addLabel(answerC, LabelLocation.BELOW);

    var centerCircle = new Circle(center);
    centerCircle.addLabel("Don't know", LabelLocation.BELOW);

    var qboard = new QuestionBoard();
    qboard.addElement(new Triangle(a, b, c))
    qboard.addElements([aCircle, bCircle, cCircle, centerCircle]);
    qboard.addElements(GenerateCirclesBetweenPoints(a, b));
    qboard.addElements(GenerateCirclesBetweenPoints(b, c));
    qboard.addElements(GenerateCirclesBetweenPoints(c, a));
    return qboard
}

var qboard = buildBoard();
qboard.redraw();
