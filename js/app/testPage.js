define (["yaml", "app/Test", "app/helpers"], function(yaml, Test, helpers) {

	var TestPage = function(data, prevCompletion, nextCompletion) {
		this.data = data;
		this.prevCompletion = prevCompletion;
		this.nextCompletion = nextCompletion;
	}
	TestPage.prototype.show = function() {
		var testStyle = this.data.style;

		console.log("Showing TestPage: " + testStyle);
		
		var base = this;
		helpers.LoadLayout("test_" + testStyle, null, null, function() {
			var questionData = YAML.load("config/questions.yaml");
			var test = new Test(testStyle, questionData[base.data.questionSet], base.data.time, base.data.order, function() {
				base.next();
			});
			test.begin();
		});
	};
	TestPage.prototype.next = function() {
		this.nextCompletion();
	}

	return TestPage;
});
