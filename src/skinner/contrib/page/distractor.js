define (["lib/jquery", "src/skinner/core/page", "src/skinner/core/keypath"], function ($, Page, keyPath) {
	"use strict";

    var DistractorPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.exercise = keyPath(this.data, "exercise", "tetris");

            if (this.exercise === "tetris") {
                this.exercise = "http://www.classicgamesarcade.com/games/flash-tetris.swf";
            }
        },
        postShow: function () {
            $("<embed/>", {
                src: this.exercise,
                width: "500px",
                height: "500px",
                autostart: "true",
                loop: "false",
                controller: "true"
            }).appendTo("#distractor-content");
        }
    });

    return DistractorPage;
});
