var LoadLayout = function(name, afterLoadHandler) {
	$("#page").load("layouts/pages/" + name + ".html", function() {
		afterLoadHandler();
	});
}

var Page = function(data, prevCompletion, nextCompletion) {
	if (data.type === "text") {
		return new TextPage(data, prevCompletion, nextCompletion);
	}
	else if (data.type === "test") {
		return new TestPage(data, prevCompletion, nextCompletion);
	}
	else if (data.type === "finish") {
		return new FinishPage(data);
	}
	else if (data.type === "distractor") {
		return new DistractorPage(data);
	}
};

var TextPage = function(data, prevCompletion, nextCompletion) {
	this.data = data;
	this.prevCompletion = prevCompletion;
	this.nextCompletion = nextCompletion;
}
TextPage.prototype.show = function() {
	console.log("Showing TextPge");

	var base = this;
	LoadLayout("text", function() {
		$("#title").text(base.data.title);
		$("#content").text(base.data.content);

		var configButton = function(button, text, clickHandler) {
			if (text) {
				button.prop("value", text);
				button.click(clickHandler);
			}
			else {
				button.hide();
			}
		}

		configButton($("#nextButton"), base.data.nextButton, function() {
			base.next();
		});
		configButton($("#prevButton"), base.data.prevButton, function() {
			base.prev();
		});
	});
};
TextPage.prototype.prev = function() {
	this.prevCompletion();
}
TextPage.prototype.next = function() {
	this.nextCompletion();
}

var DistractorPage = function(data, prevCompletion, nextCompletion) {
	this.data = data;
	this.nextCompletion = nextCompletion;
}
DistractorPage.prototype.show = function() {
	console.log("Showing DistractorPage");

	var base = this;
	LoadLayout("distractor", function() {
		var contentString = "You are now going to play tetris for 9 minutes."
		$("#content").text(contentString);
	});
};

var TestPage = function(data, prevCompletion, nextCompletion) {
	this.data = data;
	this.nextCompletion = nextCompletion;
}
TestPage.prototype.show = function() {
	console.log("Showing TestPage");

	var testStyle = this.data.style;
	var base = this;
	LoadLayout("test_" + testStyle, function() {
		$.getJSON("json/questions.json").then(function(json) {
		    var t = new TriangleTest(json[base.data.questionSet], base.data.time, base.data.order, function() {
				base.next();
			});
			t.begin();
		});
	});
};
TestPage.prototype.next = function() {
	this.nextCompletion();
}