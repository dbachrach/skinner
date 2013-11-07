define(function () {
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

        var pageData = this.pages[this.currentPage];
        require(["app/" + pageData.type + "Page"], function (Page) {
            var question = new Page(pageData, pageCompletePrev, pageCompleteNext);
            question.show();
        });
    };
    Experiment.prototype.end = function () {
        console.log("End experiment");
    };

    return Experiment;
});
