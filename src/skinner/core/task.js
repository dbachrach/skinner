define(["jquery", "underscore", "src/skinner/core/skinner", "src/skinner/core/helpers"], function ($, _, skinner, helpers) {
    "use strict";

    function Task(trial, pages, subject, additionalDimensionData, context) {
        this.trial = trial;
        this.pages = pages;
        this.subject = subject;
        this.additionalDimensionData = additionalDimensionData;
        this.context = context;
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

        var pageData = helpers.resolveData(this.pages[this.currentPageIndex], this.subject, this.additionalDimensionData, this.context);

        // TODO: Handle an unless statement
        var skipPage = false;
        var showStatement = pageData["show"];
        if (showStatement) {
            // TODO: Generalize this
            var matches = showStatement.match(/^(.*) (.*) is "(.*)"$/);
            // TODO: Proper chekcing all matches
            var command = matches[1];
            if (command === "if" && matches[1] !== matches[2]) {
                skipPage = true;
            }
            else if (command === "unless" && matches[1] === matches[2]) {
                skipPage = true;
            }
        }

        if (skipPage) {
            console.log("Ignoring this page.");
            this.nextPage();
            return;
        }

        skinner.loadModule(pageData.type, "page", function (Page) {
            base.currentPage = new Page(pageData, base);

            // Load layout on the page's behalf
            var layoutName = base.currentPage.layoutName || base.currentPage.data.type;

            var bindContent = _.extend({}, base.currentPage.data, base.currentPage.extendedBindContent);
            skinner.loadPageLayout(layoutName, bindContent, function () {

                base.updateButtons(pageData);

                if (_.isFunction(base.currentPage.show)) {
                    base.currentPage.show();
                }
            });
        });
    };
    Task.prototype.previous = function () {
        // TODO: Handle going back from one task to the previous task
        if (_.isFunction(this.currentPage.prev)) {
            this.currentPage.prev();
        }
        else {
            this.currentPageIndex--;
            this.showPage();
        }
    }
    Task.prototype.next = function () {
        if (_.isFunction(this.currentPage.next)) {
             this.currentPage.next();
        }
        else {
            this.nextPage();
        }
    }
    Task.prototype.nextPage = function () {
        this.currentPageIndex++;
        this.showPage();
    }
    Task.prototype.end = function () {
        this.trial.nextStep();
    };
    Task.prototype.updateButtons = function (pageData) {
        skinner.loadLayoutInPackage("buttons", "src/skinner/core/", pageData, "#buttons");
    }

    return Task;
});
