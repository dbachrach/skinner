define(["lib/jquery", "lib/lodash", "lib/class", "src/skinner/core/loader", "src/skinner/core/resolver", "peg!src/skinner/core/parser/showStatement"], function ($, _, Class, loader, resolver, ShowStatementParser) {
    "use strict";

    var Task = Class.extend({
        // TODO: Rename context parameter, this is the repeat-index at the moment
        init: function (name, trial, pages, subject, additionalDimensionData, context) {
            this.name = name;
            this.trial = trial;
            this.pages = pages;
            this.subject = subject;
            this.additionalDimensionData = additionalDimensionData;
            this.context = context;
        },
        id: function () {
            return this.name + "-" + this.context;
        },
        begin: function () {
            this.currentPageIndex = 0;
            this.showPage();
        },
        showPage: function () {
            if (this.pages.length <= this.currentPageIndex) {
                return this.moveToNextStep();
            }
            // TODO: Handle back button reloads a new page rather than using the old one
            var base = this;

            var pageData = resolver.resolveData(this.pages[this.currentPageIndex], this.subject, this.additionalDimensionData, this.context);
            var showStatement = pageData.show;
            if (showStatement) {
                var showPage = ShowStatementParser.parse(showStatement);
                if (!showPage) {
                    console.log("Ignoring this page.");
                    this.nextPage();
                    return;
                }
            }

            loader.loadModule(pageData.type, "page", function (Page) {
                base.currentPage = new Page(pageData, base);
                base.currentPage.show();
            });
        },
        previous: function () {
            this.currentPage.previous();
        },
        next: function () {
            this.currentPage.next();
        },
        nextPage: function () {
            this.currentPageIndex++;
            this.showPage();
        },
        previousPage: function () {
            // TODO: Handle going back from one task to the previous task
            this.currentPageIndex--;
            this.showPage();
        },
        moveToNextStep: function () {
            this.trial.nextStep();
        }
    });

    return Task;
});
