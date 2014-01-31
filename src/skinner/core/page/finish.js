define (["lib/jquery", "lib/lodash", "lib/mousetrap", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath"], function ($, _, Mousetrap, Page, loader, keyPath) {
    "use strict";

    var FinishPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);
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
