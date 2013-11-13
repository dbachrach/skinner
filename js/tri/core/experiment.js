define(["require", "jquery", "underscore", "tri/core/tri", "tri/core/helpers"], function (require, $, _, tri, helpers) {
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
            
            $("#prevButton").hide();
            $("#nextButton").hide();

            base.currentPageIndex = 0;
            base.showPage();
        });
    };
    Experiment.prototype.showPage = function () {
        console.log("Show page: " + this.currentPageIndex + " of " + this.pages.length);

        if (this.pages.length <= this.currentPageIndex) {
            return this.end();
        }
        // TODO: Handle back button reloads a new page rather than using the old one
        var base = this;

        var pageData = this.pages[this.currentPageIndex];
        console.log("loading page data");
        console.log(pageData);
        tri.loadModule(pageData.type, "page", function (Page) {
            base.currentPage = new Page(pageData, base);

            // Load layout on the page's behalf
            var layoutName = base.currentPage.layoutName || base.currentPage.data.type;
            console.log("Layoutname " + base.currentPage.layoutName + " " + base.currentPage.data.type + " " + layoutName)
            var bindable = base.currentPage.bindable || [];
            var bindContent = _.extend({}, base.currentPage.data, base.currentPage.extendedBindContent);
            helpers.LoadLayout(layoutName, bindable, bindContent, base, function () {
                if (_.isFunction(base.currentPage.show)) {
                    base.currentPage.show();
                }
            });
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
