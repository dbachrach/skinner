define (["src/skinner/core/page", "src/skinner/core/keypath"], function(Page, keyPath) {
	"use strict";

    var DistractorPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.exercise = keyPath(this.data, "exercise", "tetris");
        },
    });

    return DistractorPage;
});
