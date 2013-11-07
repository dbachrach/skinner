define(["app/page"], function (Page) {
    "use strict";

    function Experiment(pages) {
        this.pages = pages;
    }

    Experiment.prototype.begin = function () {
        this.currentPage = 0;
        this.showPage();
    };
    Experiment.prototype.showPage = function () {
        console.log("Show page: " + this.currentPage + " of " + this.pages.length);

        if (this.pages.length <= this.currentPage) {
            return this.end();
        }

        var base = this;
        function pageCompletePrev() {
            base.currentPage--;
            base.showPage();
        }
        function pageCompleteNext() {
            base.currentPage++;
            base.showPage();
        }
        var page = new Page(this.pages[this.currentPage], pageCompletePrev, pageCompleteNext);
        page.show();
    };
    Experiment.prototype.end = function () {
        console.log("End experiment");
    };

    return Experiment;
});
