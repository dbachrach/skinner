define (["lib/lodash", "lib/class", "lib/mousetrap", "src/skinner/core/loader"], function (_, Class, Mousetrap, loader) {
    "use strict";

    function pathFind(obj, path, defaultValue) {
        var foundValue = _.reduce(path.split("."), function (o, val) {
            if (!_.isUndefined(o) && o.hasOwnProperty(val)) {
                return o[val];
            }
            else {
                return undefined;
            }
            return o[val];
        }, obj);

        if (_.isUndefined(foundValue)) {
            return defaultValue;
        }
        else {
            return foundValue;
        }
    }

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
            var nextKey = pathFind(this.data, "next.keys", []);
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

            var previousKeys = pathFind(this.data, "previous.keys", []);
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
