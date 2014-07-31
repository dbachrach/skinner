define (["lib/jquery", "lib/lodash", "lib/mousetrap", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath"], function ($, _, Mousetrap, Page, loader, keyPath) {
    "use strict";

    function randomString(L){
        var s = '';
        var randomchar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) {
                return n; //1-10
            }
            if (n < 36) {
                return String.fromCharCode(n + 55); //A-Z
            }
            return String.fromCharCode(n + 61); //a-z
        };
        while (s.length< L) {
            s+= randomchar();
        }
        return s;
    }

    var FinishPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            if (keyPath(this.data, "supplies verification code", false)) {
                this.verificationCode = randomString(10);

                var pageId = this.id();
                var contextId = "finish";
                this.task.subject.report(pageId, contextId, "verification code", this.verificationCode);
            }
        },
        extendedBindContent: function () {
            if (_.isUndefined(this.verificationCode)) {
                return {};
            }
            return { verificationCode: this.verificationCode };
        },
        postShow: function () {
            // TODO: Better way to get bind content
            var bindContent = _.extend({}, this.data, this.extendedBindContent());

            var base = this;
            loader.loadLayoutInPackage("finishStatus", "src/skinner/core/", bindContent, "#finishContent", function () {
                base.task.trial.end(function (error) {
                    loader.loadLayoutInPackage("finishCompleted", "src/skinner/core/", bindContent, "#finishContent", function () {
                        if (!_.isUndefined(error)) {
                            $("<div/>", {
                                class: "ui red message",
                                html: keyPath(base.data, "error text", error)
                            }).appendTo("#finishContent");
                        }
                    });
                });
            });

            Mousetrap.bind("r e s u l t s", function () {
                var csv = base.task.trial.subject.exportToCSV();
                $("#resultData").html(csv);
                $("#resultMessage").show();
            });
        }
    });

    return FinishPage;
});
