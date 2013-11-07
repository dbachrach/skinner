define (["app/helpers"], function(helpers) {

	var DistractorPage = function(data, prevCompletion, nextCompletion) {
		this.data = data;
		this.nextCompletion = nextCompletion;
	}
	DistractorPage.prototype.show = function() {
		console.log("Showing DistractorPage");

		var bindData = {"content" : "You are now going to play tetris for 9 minutes."};
		helpers.LoadLayout("distractor", _.keys(bindData), bindData);
	};

	return DistractorPage;
});
