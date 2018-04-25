define (["lib/jquery", "src/skinner/core/page", "src/skinner/core/keypath"], function ($, Page, keyPath) {
	"use strict";

    var DistractorPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.exercise = keyPath(this.data, "exercise", "tetris");
        },
        postShow: function () {
            if (this.exercise === "tetris") {
                $("<embed/>", {
                    src: "http://www.classicgamesarcade.com/games/flash-tetris.swf",
                    width: "500px",
                    height: "500px",
                    autostart: "true",
                    loop: "false",
                    controller: "true"
                }).appendTo("#distractor-content");
            }
            else if (this.exercise === "tetris2") {
                $("<iframe/>", {
                    style: 'width:500px; height:500px;border:0;margin:20px;',
                    src: 'vendor/blockrain.html'
                }).appendTo("#distractor-content");;
            }
        }
    });

    return DistractorPage;
});
