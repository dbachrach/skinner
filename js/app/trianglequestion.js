define (["jquery"], function(jquery) {
	"use strict";

	var LabelLocation = {
		ABOVE: 0,
		BELOW: 1
	}

	function Point(x, y, color) {
	   this.x = x;
	   this.y = y;
	   color = typeof color !== 'undefined' ? color : "black"; // default is black
	   this.color = color;
	}

	function Circle(center) {
		var defaultRadius = 8;

		this.interactive = true;
		this.center = center;
		this.radius = defaultRadius;

		this.hasLabel = false;
		this.labelText = null;
		this.labelLocation = LabelLocation.BELOW;

		this.selected = false;
		this.highlighted = false;
	}
	Circle.prototype.addLabel = function (text, location) {
		this.hasLabel = true;
		this.labelText = text;
		this.labelLocation = location;
	}
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
	}
	Circle.prototype.drawLabel = function (ctx) {
	    var labelOffset = 28 * ((this.labelLocation === LabelLocation.BELOW) ? 1 : -1);
	    ctx.fillStyle = "black";
	    ctx.font = "16px Verdana";
	    ctx.textAlign = "center";
	    ctx.fillText(this.labelText, this.center.x, this.center.y + labelOffset);
	}
	Circle.prototype.hitTest = function (p) {
		var clickOffset = this.radius * 3;
		if ((Math.pow((p.x - this.center.x), 2) + Math.pow((p.y - this.center.y), 2)
				<= Math.pow(this.radius + clickOffset, 2))) {
			return this;
		}
		return null;
	}
	Circle.prototype.clicked = function () {
		this.selected = true;
	}
	Circle.prototype.deselect = function () {
		this.selected = false;
	}
	Circle.prototype.highlight = function () {
		this.highlighted = true;
	}
	Circle.prototype.unhighlight = function () {
		this.highlighted = false;
	}

	var Triangle = function (d, e, f) {
		this.interactive = false;

		this.d = d;
		this.e = e;
		this.f = f;
	}
	Triangle.prototype.draw = function (ctx) {
		this.drawLine(ctx, this.d, this.e);
		this.drawLine(ctx, this.e, this.f);
		this.drawLine(ctx, this.f, this.d);    
	}
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
	}


	function QuestionBoard(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas[0].getContext('2d');

		this.elements = new Array();

		this.attachMouseHandlers();
	}
	QuestionBoard.prototype.addElement = function (element) {
		this.elements.push(element);
	}
	QuestionBoard.prototype.addElements = function (elements) {
		this.elements = this.elements.concat(elements);	
	}
	QuestionBoard.prototype.interactiveElements = function () {
		return this.elements.filter(function(e) {
			return e.interactive;
		})
	}
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
	}
	QuestionBoard.prototype.hitTest = function (p) { 
	    var hit = this.interactiveElements().filter(function (e) {
			return (e.hitTest(p));
		});
		return hit[0];
	}
	QuestionBoard.prototype.deselectAll = function () {
		this.interactiveElements().forEach(function (e) {
			e.deselect();
		});
	}
	QuestionBoard.prototype.unhighlightAll = function () {
	    this.interactiveElements().forEach(function (e) {
			e.unhighlight();
		});
	}


	var GenerateCirclesBetweenPoints = function (d, e) {
		var midval = function(v1, v2, percent) {
			return v1 + ((v2 - v1) * percent); 
		}

		var midcolor = function (color1, color2, percent) {
			var rgb1 = color1.match(/\d+/g);
		    var rgb2 = color2.match(/\d+/g);
		    var rMid = midval(parseInt(rgb1[0]), parseInt(rgb2[0]), percent);
		    var gMid = midval(parseInt(rgb1[1]), parseInt(rgb2[1]), percent);
		    var bMid = midval(parseInt(rgb1[2]), parseInt(rgb2[2]), percent);
		    return "rgb(" + Math.round(rMid) + "," + Math.round(gMid) + "," + Math.round(bMid) + ")";
		}

		var midpoint = function (p1, p2, percent) {
			var xMid = midval(p1.x, p2.x, percent);
		    var yMid = midval(p1.y, p2.y, percent);
		    var colorMid = midcolor(p1.color, p2.color, percent);
			return new Point(xMid, yMid, colorMid);
		}

	    var pointsPerEdge = 3;
	    var circles = new Array(pointsPerEdge);
	    for (var i = 1; i <= pointsPerEdge; i++) {
	        circles[i-1] = new Circle(midpoint(d, e, i / (pointsPerEdge + 1)));
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
	}
	QuestionBoard.prototype.getCursorPosition = function (e) {
	    var x;
	    var y;
	    if (e.pageX != undefined && e.pageY != undefined) {
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
	}

	function TriangleQuestion(question) {
		this.question = question;
	}
	TriangleQuestion.prototype.show = function () {
		console.log("Showing TriangleQuestion");
	    $("#question").text(this.question.question);

	    var canvas = $("#questionCanvas");
	    var qboard = this.buildBoard(canvas);
		qboard.redraw();
	}
	TriangleQuestion.prototype.buildBoard = function (canvas) {
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

	return TriangleQuestion;
});