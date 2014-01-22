define (["lib/jquery", "lib/mousetrap", "src/skinner/core/page", "src/skinner/core/loader"], function ($, Mousetrap, Page, loader) {
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
                base.task.trial.end(function () {
                    loader.loadLayoutInPackage("finishCompleted", "src/skinner/core/", bindContent, "#finishContent");
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
