define (["src/skinner/core/page", "src/skinner/core/loader"], function(Page, loader) {
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
        }
    });

    return FinishPage;
});
