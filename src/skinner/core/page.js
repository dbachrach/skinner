define (["lib/lodash", "lib/class", "lib/mousetrap", "src/skinner/core/loader", "src/skinner/core/intervals", "src/skinner/core/keypath"], function (_, Class, Mousetrap, loader, intervals, keyPath) {
    "use strict";

    var Page = Class.extend({
        init: function (data, task) {
            this.data = data;
            this.task = task;
            this.type = keyPath(this.data, "type");

            this.time = intervals.parseTimeInterval(keyPath(this.data, "time"));
            this.autoStartPageTimer = true;
        },
        id: function () {
            return this.task.id() + "-" + this.type;
        },
        show: function () {
            this.preShow();

            var base = this;

            var bindContent = _.extend({}, this.data, this.extendedBindContent());
            loader.loadPageLayout(this.layoutName(), bindContent, function () {

                base.updateButtons();
                base.updateKeys(true);

                if (base.autoStartPageTimer) {
                    base.startPageTimer();
                }

                base.postShow();
            });
        },
        preShow: function () {
            // Override
        },
        postShow: function () {
            // Override
        },
        startPageTimer: function () {
            if (_.isNumber(this.time)) {
                var base = this;
                this.timeout = setTimeout(function () {
                    base.pageTimerFired();
                }, this.time);
            }
        },
        pageTimerFired: function () {
            this.next();
        },
        cancelPageTimer: function () {
            if (!_.isUndefined(this.timeout)) {
                clearTimeout(this.timeout);
            }
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
            this.cancelPageTimer();
            this.moveToNextPage();
        },
        moveToNextPage: function () {
            this.hide();
            this.task.nextPage();
        },
        layoutName: function () {
            return this.type;
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
        }
    });

    return Page;
});
