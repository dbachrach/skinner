var LoadLayout = function(name, bindings, data, afterLoadHandler) {
	$("#page").load("layouts/pages/" + name + ".html", function() {
		_.each(bindings, function(binding) {
			var field = $("#" + binding);
			var bindValue = data[binding];
			var bindFile = data[binding + "File"];

			if (bindValue) {
				field.text(bindValue);
				field.prop("value", bindValue);
			}
			else if (bindFile) {
				field.load("content/" + bindFile + ".txt");
			}
			else {
				field.hide();
			}
		});
		if (afterLoadHandler) { afterLoadHandler(); }
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
	LoadLayout("text", ["title", "content", "prevButton", "nextButton"], base.data, function() {
		$("#nextButton").click(function() {
			base.next();
		});
		$("#prevButton").click(function() {
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

	var bindData = {"content" : "You are now going to play tetris for 9 minutes."};
	LoadLayout("distractor", _.keys(bindData), bindData);
};

var TestPage = function(data, prevCompletion, nextCompletion) {
	this.data = data;
	this.nextCompletion = nextCompletion;
}
TestPage.prototype.show = function() {
	var testStyle = this.data.style;

	console.log("Showing TestPage: " + testStyle);
	
	var base = this;
	LoadLayout("test_" + testStyle, null, null, function() {
		var questionData = YAML.load("json/questions.yaml");
		var test = new Test(testStyle, questionData[base.data.questionSet], base.data.time, base.data.order, function() {
			base.next();
		});
		test.begin();
	});
};
TestPage.prototype.next = function() {
	this.nextCompletion();
}