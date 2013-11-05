
var Experiment = function(pages) {
	this.pages = pages;
}

Experiment.prototype.begin = function() {
	this.currentPage = 0;
	this.showPage();
};
Experiment.prototype.showPage = function() {
	console.log("Show page: " + this.currentPage + " of " + this.pages.length);

	if (this.pages.length <= this.currentPage) {
		return this.end();
	}

	var base = this;
	var pageCompletePrev = function() {
		base.currentPage--;
		base.showPage();
	}
	var pageCompleteNext = function() {
		base.currentPage++;
		base.showPage();
	}
	var page = new Page(this.pages[this.currentPage], pageCompletePrev, pageCompleteNext);
	page.show();
};
Experiment.prototype.end = function() {
	console.log("End experiment");
};

console.log("Starting experiment");

// TODO: Shouldn't need this in production
$.ajaxSetup ({
    cache: false // Disable caching of AJAX responses
});

var expData = YAML.load("json/experiment.yaml");
var exp = new Experiment(expData["pages"]);
exp.begin();