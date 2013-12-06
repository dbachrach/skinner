define (["lib/lodash", "lib/class", "lib/mousetrap", "src/skinner/core/loader", "src/skinner/core/keyPath"], function (_, Class, Mousetrap, loader, keyPath) {
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
                base.updateKeys(true);

                base.postShow();
            });
        },
        preShow: function () {
            // Override
        },
        postShow: function () {
            // Override
        },
        hide: function() {
            this.preHide();

            this.updateKeys(false);

            this.postHide();
        },
        preHide: function () {
            // Override
        },
        postHide: function () {
            // Override
        },
        next: function () {
            this.moveToNextPage();
        },
        previous: function () {
            this.moveToPreviousPage();
        },
        moveToNextPage: function () {
            this.hide();
            this.task.nextPage();
        },
        moveToPreviousPage: function () {
            this.hide();
            this.task.previousPage();
        },
        layoutName: function () {
            return this.data.type;
        },
        extendedBindContent: function () {
            return {};
        },
        updateButtons: function () {
            // Update UI Buttons
            loader.loadLayoutInPackage("buttons", "src/skinner/core/", this.data, "#buttons");
        },
        updateKeys: function(enable) {
            // Update keys
            var base = this;
            var nextKey = keyPath(this.data, "next.keys", []);
            if (nextKey) {
                if (enable) {
                    Mousetrap.bind(nextKey, function (e) {
                        base.next();
                    });
                }
                else {
                    Mousetrap.unbind(nextKey);
                }
            }

            var previousKeys = keyPath(this.data, "previous.keys", []);
            if (previousKeys) {
                if (enable) {
                    Mousetrap.bind(previousKeys, function (e) {
                        base.previous();
                    });
                }
                else {
                    Mousetrap.unbind(previousKeys);
                }
            }
        }
    });

    return Page;
});
