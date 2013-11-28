define (["underscore", "class", "src/skinner/core/loader"], function (_, Class, loader) {
    "use strict";

    var Page = Class.extend({
        init: function (data, task) {
            this.data = data || {};
            this.task = task;
        },
        show: function () {
            this.preShow();

            var base = this;

            var bindContent = _.extend({}, this.data, this.extendedBindContent());
            loader.loadPageLayout(this.layoutName(), bindContent, function () {

                base.updateButtons();

                base.postShow();
            });
        },
        preShow: function () {
            // Override
        },
        postShow: function () {
            // Override
        },
        next: function () {
            this.moveToNextPage();
        },
        previous: function () {
            this.moveToPreviousPage();
        },
        moveToNextPage: function () {
            this.task.nextPage();
        },
        moveToPreviousPage: function () {
            this.task.previousPage();
        },
        layoutName: function () {
            return this.data.type;
        },
        extendedBindContent: function () {
            return {};
        },
        updateButtons: function () {
            loader.loadLayoutInPackage("buttons", "src/skinner/core/", this.data, "#buttons");
        }
    });

    return Page;
});
