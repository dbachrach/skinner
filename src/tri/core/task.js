define(["jquery", "underscore", "src/tri/core/tri", "src/tri/core/helpers"], function ($, _, tri, helpers) {
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
        console.log("Task.showPage() :: Show page: " + (this.currentPageIndex + 1) + " of " + this.pages.length);

        if (this.pages.length <= this.currentPageIndex) {
            return this.end();
        }
        // TODO: Handle back button reloads a new page rather than using the old one
        var base = this;

        var pageData = helpers.resolveData(this.pages[this.currentPageIndex], this.subject);

        tri.loadModule(pageData.type, "page", function (Page) {
            base.currentPage = new Page(pageData, base);

            // Load layout on the page's behalf
            var layoutName = base.currentPage.layoutName || base.currentPage.data.type;

            var bindContent = _.extend({}, base.currentPage.data, base.currentPage.extendedBindContent);
            tri.loadPageLayout(layoutName, bindContent, function () {

                base.updateButtons(pageData);

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
        this.trial.nextStep();
    };
    Task.prototype.updateButtons = function (pageData) {
        tri.loadLayoutInPackage("buttons", "src/tri/core/", pageData, "#buttons");
    }

    return Task;
});
