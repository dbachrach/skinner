define (["lib/jquery", "src/skinner/core/question"], function($, Question) {
    "use strict";

    var LabelLocation = {
        ABOVE: 0,
        BELOW: 1,
        LEFT: 2,
        RIGHT: 3
    };

    var correctAnswerScore = 3;
    var incorrectAnswerScore = -10;
    var noAnswerScore = 0;

    function Point(x, y, color) {
       this.x = x;
       this.y = y;
       color = color || "black";
       this.color = color;
    }

    function Circle(center, answerId, score) {
        var defaultRadius = 8;

        this.interactive = true;
        this.center = center;
        this.radius = defaultRadius;

        this.score = score;

        this.hasLabel = false;
        this.labelText = null;
        this.labelLocation = LabelLocation.BELOW;

        this.selected = false;
        this.highlighted = false;

        this.answerId = answerId;
    }
    Circle.prototype.addLabel = function (text, location) {
        this.hasLabel = true;
        this.labelText = text;
        this.labelLocation = location;
    };
    Circle.prototype.draw = function (ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";

        if (this.selected) {
            ctx.lineWidth = ctx.lineWidth * 2;
        }

        var unselectedColor = "white";
        var fillColor = unselectedColor;

        if (this.highlighted) { fillColor = this.center.color; }
        if (this.selected) { fillColor =  this.center.color; }

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        if (this.selected) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = "white";
            ctx.stroke();
        }

        if (this.hasLabel) {
            this.drawLabel(ctx);
        }
    };
    Circle.prototype.drawLabel = function (ctx) {
        var labelOffsetX = 0;
        var labelOffsetY = 0;
        if (this.labelLocation === LabelLocation.BELOW) {
            labelOffsetY = 28;
        }
        else if (this.labelLocation == LabelLocation.ABOVE) {
            labelOffsetY = -28;
        }
        else if (this.labelLocation === LabelLocation.LEFT) {
            labelOffsetX = -28;
        }
        else if (this.labelLocation === LabelLocation.RIGHT) {
            labelOffsetX = 28;
        }

        ctx.fillStyle = "black";
        ctx.font = "16px Verdana";
        ctx.textAlign = "center";
        ctx.fillText(this.labelText, this.center.x + labelOffsetX, this.center.y + labelOffsetY);
    };
    Circle.prototype.hitTest = function (p) {
        var clickOffset = this.radius * 3;
        if ((Math.pow((p.x - this.center.x), 2) + Math.pow((p.y - this.center.y), 2) <= Math.pow(this.radius + clickOffset, 2))) {
            return this;
        }
        return null;
    };
    Circle.prototype.clicked = function () {
        this.selected = true;
    };
    Circle.prototype.deselect = function () {
        this.selected = false;
    };
    Circle.prototype.highlight = function () {
        this.highlighted = true;
    };
    Circle.prototype.unhighlight = function () {
        this.highlighted = false;
    };

    var Triangle = function (d, e, f) {
        this.interactive = false;

        this.d = d;
        this.e = e;
        this.f = f;
    };
    Triangle.prototype.draw = function (ctx) {
        this.drawLine(ctx, this.d, this.e);
        this.drawLine(ctx, this.e, this.f);
        this.drawLine(ctx, this.f, this.d);
    };
    Triangle.prototype.drawLine = function (ctx, p1, p2) {
        ctx.lineWidth = 8;

        var gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, p1.color);
        gradient.addColorStop(1, p2.color);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.stroke();
    };


    function QuestionBoard(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas[0].getContext('2d');

        if(window.devicePixelRatio === 2) {
            this.ctx.scale(2, 2);
        }

        this.elements = [];

        this.attachMouseHandlers();
    }
    QuestionBoard.prototype.addElement = function (element) {
        this.elements.push(element);
    };
    QuestionBoard.prototype.addElements = function (elements) {
        this.elements = this.elements.concat(elements);
    };
    QuestionBoard.prototype.interactiveElements = function () {
        return this.elements.filter(function(e) {
            return e.interactive;
        });
    };
    QuestionBoard.prototype.redraw = function () {
        this.ctx.clearRect(0, 0, 600, 450);

     //    ctx.beginPath();
     //    ctx.moveTo(a.x, a.y);
     //    ctx.arc(a.x, a.y, 3 * edge / 4, Math.PI / 3, 2 * Math.PI / 3);
     //    ctx.closePath();
     //    var radialGradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 3*edge/4);
     //    radialGradient.addColorStop(0, "rgba(255, 0, 0, 1.0)");
     //    radialGradient.addColorStop(1, "rgba(255, 0, 0, 0.0)");
     //    ctx.fillStyle = radialGradient;
     //    ctx.fill();

     //    ctx.beginPath();
     //    ctx.moveTo(b.x, b.y);
     //    ctx.arc(b.x, b.y, 3 * edge / 4, 5 *Math.PI / 3, 0);
     //    ctx.closePath();
     //    var radialGradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 3*edge/4);
        // radialGradient.addColorStop(0, "rgba(255, 255, 0, 1.0)");
     //    radialGradient.addColorStop(1, "rgba(255, 255, 0, 0.0)");
     //    ctx.fillStyle = radialGradient;
     //    ctx.fill();

     //    ctx.beginPath();
     //    ctx.moveTo(c.x, c.y);
     //    ctx.arc(c.x, c.y, 3 * edge / 4, Math.PI, 4 * Math.PI / 3);
     //    ctx.closePath();
     //    var radialGradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 3*edge/4);
     //    radialGradient.addColorStop(0, "rgba(0, 0, 255, 1.0)");
     //    radialGradient.addColorStop(1, "rgba(0, 0, 255, 0.0)");
     //    ctx.fillStyle = radialGradient;
     //    ctx.fill();

        this.elements.forEach(function (e) {
            e.draw(this.ctx);
        }, this);
    };
    QuestionBoard.prototype.hitTest = function (p) {
        var hit = this.interactiveElements().filter(function (e) {
            return (e.hitTest(p));
        });
        return hit[0];
    };
    QuestionBoard.prototype.deselectAll = function () {
        this.interactiveElements().forEach(function (e) {
            e.deselect();
        });
    };
    QuestionBoard.prototype.unhighlightAll = function () {
        this.interactiveElements().forEach(function (e) {
            e.unhighlight();
        });
    };


    function generateCirclesBetweenCircles(d, e, pointsPerEdge, labelLocation, showScore) {
        var midval = function(v1, v2, percent) {
            return v1 + ((v2 - v1) * percent);
        };

        var midcolor = function (color1, color2, percent) {
            var rgb1 = color1.match(/\d+/g);
            var rgb2 = color2.match(/\d+/g);
            var rMid = midval(parseInt(rgb1[0], 10), parseInt(rgb2[0], 10), percent);
            var gMid = midval(parseInt(rgb1[1], 10), parseInt(rgb2[1], 10), percent);
            var bMid = midval(parseInt(rgb1[2], 10), parseInt(rgb2[2], 10), percent);
            return "rgb(" + Math.round(rMid) + "," + Math.round(gMid) + "," + Math.round(bMid) + ")";
        };

        var midpoint = function (p1, p2, percent) {
            var xMid = midval(p1.x, p2.x, percent);
            var yMid = midval(p1.y, p2.y, percent);
            var colorMid = midcolor(p1.color, p2.color, percent);
            return new Point(xMid, yMid, colorMid);
        };

        var scoreBetweenCircles = function (p1, p2, step) {
            if (p1.score === incorrectAnswerScore && p2.score === incorrectAnswerScore) {
                return incorrectAnswerScore;
            }
            else if (p1.score === correctAnswerScore) {
                if (step == 1) {
                    return 2;
                }
                else if (step == 2) {
                    return 1;
                }
                else if (step == 3) {
                    return -1;
                }
            }
            else if (p2.score === correctAnswerScore) {
                if (step == 1) {
                    return -1;
                }
                else if (step == 2) {
                    return 1;
                }
                else if (step == 3) {
                    return 2;
                }
            }
        };

        var circles = [];
        for (var i = 1; i <= pointsPerEdge; i++) {
            var percent = i / (pointsPerEdge + 1);
            circles[i-1] = new Circle(midpoint(d.center, e.center, percent), d.answerId + "-" + i + "-" + e.answerId, scoreBetweenCircles(d, e, i));
            if (showScore) {
                circles[i-1].addLabel(" (" + circles[i-1].score + ")", labelLocation);
            }
        }
        return circles;
    }
    QuestionBoard.prototype.attachMouseHandlers = function () {
        var base = this;
        this.canvas.click(function (e) {
            var p = base.getCursorPosition(e);
            var circle = base.hitTest(p);
            if (circle) {
                base.deselectAll();
                circle.clicked();
            }
            base.redraw();
        });

        this.canvas.mousemove(function (e) {
            var p = base.getCursorPosition(e);
            var circle = base.hitTest(p);
            base.unhighlightAll();
            if (circle) {
                circle.highlight();
                base.canvas.css("cursor", "pointer");
            }
            else {
                base.canvas.css("cursor", "default");
            }
            base.redraw();
        });
    };
    QuestionBoard.prototype.getCursorPosition = function (e) {
        var x;
        var y;
        if (e.pageX !== undefined && e.pageY !== undefined) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
        }
        x -= this.canvas[0].offsetLeft;
        y -= this.canvas[0].offsetTop;
        return new Point(x, y);
    };
    QuestionBoard.prototype.selectedAnswer = function () {
        var selectedCircles = this.interactiveElements().filter(function (e) {
            return e.selected;
        });
        if (selectedCircles.length !== 1) {
            return "unanswered";
        }
        return selectedCircles[0].answerId;
    };
    QuestionBoard.prototype.selectedAnswerScore = function () {
        var selectedCircles = this.interactiveElements().filter(function (e) {
            return e.selected;
        });
        if (selectedCircles.length !== 1) {
            return 0;
        }
        return selectedCircles[0].score;
    };


    var TriangleQuestion = Question.extend({
        init: function (data, id, testData, style) {
            this._super(data, id, testData, style);

            this.pointsPerEdge = testData.pointsPerEdge || 3;
        },
        postShow: function () {
            var canvas = $("#questionCanvas");
            canvas[0].style.width = "600px";
            canvas[0].style.height = "450px";
            if(window.devicePixelRatio === 2) {
                canvas[0].width = 1200;
                canvas[0].height = 900;
            }
            else {
                canvas[0].width = 600;
                canvas[0].height = 450;
            }
            var showScore = false;
            this.qboard = this.buildBoard(canvas, showScore);
            this.qboard.redraw();
        },
        selectedAnswer: function() {
            return this.qboard.selectedAnswer();
        },
        maxScore: function () {
            return 3;
        },
        tallyScore: function () {
            console.log("Triangle Score: " + this.qboard.selectedAnswerScore());
            return this.qboard.selectedAnswerScore();
        },
        buildBoard: function (canvas, showScore) {
            var edge = 400.0;
            var xOffset = (600 - edge) / 2;
            var yOffset = 50.0;

            var triangleHeight = Math.sqrt((Math.pow(edge, 2) - (Math.pow(edge / 2, 2))));

            var a = new Point(xOffset + (edge / 2), yOffset, "rgb(255,0,0)");
            var b = new Point(xOffset, yOffset + triangleHeight, "rgb(255,255,0)");
            var c = new Point(b.x + edge, b.y, "rgb(0,0,255)");

            var center = new Point(a.x, b.y - (Math.tan(Math.PI / 6) * (edge/2)));

            // Assumes only one correct answer
            var correctAnswer = this.correctAnswers()[0];

            var aCircle = new Circle(a, this.data.answers[0], (this.data.answers[0] === correctAnswer) ? correctAnswerScore : incorrectAnswerScore);
            aCircle.addLabel(this.data.answers[0] + ((showScore) ? " (" + aCircle.score + ")" : ""), LabelLocation.ABOVE);
            var bCircle = new Circle(b, this.data.answers[1], (this.data.answers[1] === correctAnswer) ? correctAnswerScore : incorrectAnswerScore);
            bCircle.addLabel(this.data.answers[1] + ((showScore) ? " (" + bCircle.score + ")" : ""), LabelLocation.BELOW);
            var cCircle = new Circle(c, this.data.answers[2], (this.data.answers[2] === correctAnswer) ? correctAnswerScore : incorrectAnswerScore);
            cCircle.addLabel(this.data.answers[2] + ((showScore) ? " (" + cCircle.score + ")" : ""), LabelLocation.BELOW);

            var centerCircle = new Circle(center, "none", noAnswerScore);
            centerCircle.addLabel("Don't know" + ((showScore) ? " (" + noAnswerScore + ")" : ""), LabelLocation.ABOVE);

            var qboard = new QuestionBoard(canvas);
            qboard.addElement(new Triangle(a, b, c));
            qboard.addElements([aCircle, bCircle, cCircle, centerCircle]);
            qboard.addElements(generateCirclesBetweenCircles(aCircle, bCircle, this.pointsPerEdge, LabelLocation.LEFT, showScore));
            qboard.addElements(generateCirclesBetweenCircles(bCircle, cCircle, this.pointsPerEdge, LabelLocation.BELOW, showScore));
            qboard.addElements(generateCirclesBetweenCircles(cCircle, aCircle, this.pointsPerEdge, LabelLocation.RIGHT, showScore));
            return qboard;
        }
    });

    return TriangleQuestion;
});
