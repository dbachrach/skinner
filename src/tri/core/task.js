define(["jquery", "underscore", "tri/core/tri", "tri/core/helpers"], function ($, _, tri, helpers) {
    "use strict";

    function Task(trial, pages, subject) {
        this.trial = trial;
        this.pages = pages;
        this.subject = subject;
    }

    Task.prototype.begin = function () {
        this.currentPageIndex = 0;
        this.showPage();
    };
    Task.prototype.showPage = function () {
        console.log("Show page: " + this.currentPageIndex + " of " + this.pages.length);

        if (this.pages.length <= this.currentPageIndex) {
            return this.end();
        }
        // TODO: Handle back button reloads a new page rather than using the old one
        var base = this;

        var pageData = helpers.resolveData(this.pages[this.currentPageIndex], this.subject);

        console.log("loading resolved page data:");
        console.log(pageData);
        tri.loadModule(pageData.type, "page", function (Page) {
            base.currentPage = new Page(pageData, base);

            // Load layout on the page's behalf
            var layoutName = base.currentPage.layoutName || base.currentPage.data.type;
            console.log("Layoutname " + base.currentPage.layoutName + " " + base.currentPage.data.type + " " + layoutName)
            var bindable = base.currentPage.bindable || [];
            var bindContent = _.extend({}, base.currentPage.data, base.currentPage.extendedBindContent);
            helpers.LoadLayout(layoutName, bindable, bindContent, function () {
                if (_.isFunction(base.currentPage.show)) {
                    base.currentPage.show();
                }
            });
        });
    };
    Task.prototype.previousPage = function () {
        // TODO: Handle going back from one task to the previous task
        this.currentPageIndex--;
        this.showPage();
    }
    Task.prototype.nextPage = function () {
        this.currentPageIndex++;
        this.showPage();
    }
    Task.prototype.end = function () {
        console.log("End Task");
        this.trial.nextStep();
    };

    return Task;
});
