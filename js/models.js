var LabelLocation = {
	ABOVE: 0,
	BELOW: 1
}

var Point = function(x, y, color) {
   this.x = x;
   this.y = y;
   color = typeof color !== 'undefined' ? color : "black"; // default is black
   this.color = color;
}

var Circle = function(center) {
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
Circle.prototype.addLabel = function(text, location) {
	this.hasLabel = true;
	this.labelText = text;
	this.labelLocation = location;
}
Circle.prototype.draw = function() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";

    if (this.selected) {
		ctx.lineWidth = ctx.lineWidth * 2;
	}

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
    	this.drawLabel();
    }
}
Circle.prototype.drawLabel = function() {
    var labelOffset = 28 * ((this.labelLocation == LabelLocation.BELOW) ? 1 : -1);
    ctx.fillStyle = "black";
    ctx.font = "14px Lucida Grande";
    ctx.textAlign = "center";
    ctx.fillText(this.labelText, this.center.x, this.center.y + labelOffset);
}
Circle.prototype.hitTest = function(p) {
	var clickOffset = this.radius * 3;
	if ((Math.pow((p.x - this.center.x), 2) + Math.pow((p.y - this.center.y), 2)
			<= Math.pow(this.radius + clickOffset, 2))) {
		return this;
	}
	return null;
}
Circle.prototype.clicked = function() {
	this.selected = true;
}
Circle.prototype.deselect = function() {
	this.selected = false;
}
Circle.prototype.highlight = function() {
	this.highlighted = true;
}
Circle.prototype.unhighlight = function() {
	this.highlighted = false;
}

var Triangle = function(d, e, f) {
	this.interactive = false;

	this.d = d;
	this.e = e;
	this.f = f;
}
Triangle.prototype.draw = function() {
	this.drawLine(this.d, this.e);
	this.drawLine(this.e, this.f);
	this.drawLine(this.f, this.d);    
}
Triangle.prototype.drawLine = function(p1, p2) {
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


var QuestionBoard = function() {
	this.elements = new Array();
}
QuestionBoard.prototype.addElement = function(element) {
	this.elements.push(element);
}
QuestionBoard.prototype.addElements = function(elements) {
	this.elements = this.elements.concat(elements);	
}
QuestionBoard.prototype.interactiveElements = function() {
	return this.elements.filter(function(e) {
		return e.interactive;
	})
}
QuestionBoard.prototype.redraw = function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
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

 	this.elements.forEach(function(e) {
		e.draw();
	});
}
QuestionBoard.prototype.hitTest = function(p) { 
    var hit = this.interactiveElements().filter(function(e) {
		return (e.hitTest(p));
	});
	return hit[0];
}
QuestionBoard.prototype.deselectAll = function() {
	this.interactiveElements().forEach(function(e) {
		e.deselect();
	});
}
QuestionBoard.prototype.unhighlightAll = function() {
    this.interactiveElements().forEach(function(e) {
		e.unhighlight();
	});
}


var GenerateCirclesBetweenPoints = function(d, e) {
	var midval = function(v1, v2, percent) {
		return v1 + ((v2 - v1) * percent); 
	}

	var midcolor = function(color1, color2, percent) {
		var rgb1 = color1.match(/\d+/g);
	    var rgb2 = color2.match(/\d+/g);
	    var rMid = midval(parseInt(rgb1[0]), parseInt(rgb2[0]), percent);
	    var gMid = midval(parseInt(rgb1[1]), parseInt(rgb2[1]), percent);
	    var bMid = midval(parseInt(rgb1[2]), parseInt(rgb2[2]), percent);
	    return "rgb(" + Math.round(rMid) + "," + Math.round(gMid) + "," + Math.round(bMid) + ")";
	}

	var midpoint = function(p1, p2, percent) {
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