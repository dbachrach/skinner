define(function () {
    "use strict";

    function Experiment(pages) {
        var base = this;
        $("#prevButton").click(function () {
            if (_.isFunction(base.currentPage.prev)) {
                base.currentPage.prev();
            }
            else {
                base.previousPage();
            }
        })
        $("#nextButton").click(function () {
            if (_.isFunction(base.currentPage.next)) {
                base.currentPage.next();
            }
            else {
                base.nextPage();
            }
        })
        this.pages = pages;
    }

    Experiment.prototype.begin = function () {
        this.currentPageIndex = 0;
        this.showPage();
    };
    Experiment.prototype.showPage = function () {
        console.log("Show page: " + this.currentPageIndex + " of " + this.pages.length);

        if (this.pages.length <= this.currentPageIndex) {
            return this.end();
        }

        var base = this;
        
        var pageData = this.pages[this.currentPageIndex];
        require(["app/" + pageData.type + "Page"], function (Page) {
            base.currentPage = new Page(pageData, base);
            base.currentPage.show();
        });
    };
    Experiment.prototype.previousPage = function () {
        this.currentPageIndex--;
        this.showPage();
    }
    Experiment.prototype.nextPage = function () {
        this.currentPageIndex++;
        this.showPage();
    }
    Experiment.prototype.end = function () {
        console.log("End experiment");
    };

    return Experiment;
});
