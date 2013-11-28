define (["src/skinner/core/page"], function(Page) {
	"use strict";

    var TextPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);
        },
    });
    
    return TextPage;
});
