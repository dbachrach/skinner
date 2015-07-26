define (["lib/jquery", "lib/lodash", "lib/class", "lib/mousetrap", "src/skinner/core/loader", "src/skinner/core/intervals", "src/skinner/core/keypath", "peg!src/skinner/core/parser/showTimerStatement"], function ($, _, Class, Mousetrap, loader, intervals, keyPath, ShowTimerStatement) {
    "use strict";

    var Page = Class.extend({
        init: function (data, task) {
            this.data = data;
            this.task = task;
            this.type = keyPath(this.data, "type");

            this.time = intervals.parseTimeInterval(keyPath(this.data, "time"));
            this.showNextButtonAfterTime = keyPath(this.data, "show next button after time", false)
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
            var base = this;
            var countdownElement = $("#timer");

            this.showTimer = false;

            function updateTimer() {
                // TODO: Formatting of time needs work
                if (base.showTimer && base.timerValue <= base.hideTimerUntil) {
                    countdownElement.text(base.timerValue);
                }
                base.timerValue--;
                if (base.timerValue >= 0) {
                    base.timerTimeout = _.delay(updateTimer, 1000);
                }
                else {
                    countdownElement.hide();
                    base.pageTimerFired();
                }
            }

            if (_.isNumber(this.time)) {
                this.timerValue = this.time / 1000;
                this.hideTimerUntil = this.timerValue;

                var showTimerStatement = keyPath(base.data, "show timer", false);
                if (_.isBoolean(showTimerStatement)) {
                    this.showTimer = showTimerStatement;
                }
                else if (_.isString(showTimerStatement)) {
                    var parsedShowTimer = ShowTimerStatement.parse(showTimerStatement);
                    this.hideTimerUntil = intervals.parseTimeInterval(parsedShowTimer) / 1000;

                    this.showTimer = true;
                }

                if (this.showTimer) {
                    countdownElement.text("").show();
                    updateTimer();
                }
                else {
                    _.delay(function () {
                        base.pageTimerFired();
                    }, this.time);
                }
            }
        },
        pageTimerFired: function () {
            if (this.showNextButtonAfterTime) {
                $("#nextButton").show();
            }
            else {
                this.next();
            }
        },
        cancelPageTimer: function () {
            if (!_.isUndefined(this.timerTimeout)) {
                clearTimeout(this.timerTimeout);
            }
        },
        hide: function () {
            this.preHide();

            this.updateKeys(false);

            var base = this;
            loader.unloadPageLayout(this.layoutName(), function () {
                base.postHide();
            });
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
            var base = this;

            // Update UI Buttons
            loader.loadLayoutInPackage("buttons", "src/skinner/core/", this.data, "#buttons", function() {
                if (base.showNextButtonAfterTime) {
                    $("#nextButton").hide();
                }
            });
        },
        updateKeys: function (enable) {
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
