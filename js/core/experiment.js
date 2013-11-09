define(["require", "jquery", "core/tri"], function (require, $, tri) {
    "use strict";

    function Experiment(pages, subject) {
        this.pages = pages;
        this.subject = subject;
    }

    Experiment.prototype.begin = function () {
        var base = this;
        $("#main").load("layouts/experiment.html", function () {
            $("#prevButton").click(function () {
                if (_.isFunction(base.currentPage.prev)) {
                    base.currentPage.prev();
                }
                else {
                    base.previousPage();
                }
            });
            $("#nextButton").click(function () {
                if (_.isFunction(base.currentPage.next)) {
                    base.currentPage.next();
                }
                else {
                    base.nextPage();
                }
            });
            base.currentPageIndex = 0;
            base.showPage();
        });
    };
    Experiment.prototype.showPage = function () {
        console.log("Show page: " + this.currentPageIndex + " of " + this.pages.length);

        if (this.pages.length <= this.currentPageIndex) {
            return this.end();
        }

        var base = this;
        
        var pageData = this.pages[this.currentPageIndex];
        var req = tri.getModule(pageData.type, "page");
        require([req], function (Page) {
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
