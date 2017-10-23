var wordpairFile = "ryaml!config/wordpairs";

define (["lib/jquery", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", "src/skinner/core/intervals", wordpairFile], function ($, Page, loader, keyPath, intervals, allWordpairData) {
    "use strict";

    var WordpairPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.wordpairSet = keyPath(this.data, "wordpair set");

            var aKey = keyPath(this.data, "aKey");
            var bKey = keyPath(this.data, "bKey");
            this.wordpairData = allWordpairData[this.wordpairSet]
                .map(function (d) {

                    return {
                        wordA: d[aKey],
                        wordB: d[bKey]
                    };
                });

            this.order = keyPath(this.data, "order");

            if (this.order === "random") {
                this.wordpairData = _.shuffle(this.wordpairData);
            }

            this.currentIndex = -1;

            this.autoStartPageTimer = false;
        },
        postShow: function () {
            this.nextState();
        },
        nextState: function () {
            this.currentIndex++;

            if (this.wordpairData.length > this.currentIndex) {
                this.showWordpair(this.wordpairData[this.currentIndex]);
            }
            else {
                this.moveToNextPage();
            }
        },
        showWordpair: function (data) {
            var layout = 'wordpair-single';
            loader.loadLayoutInPackage(layout, "src/skinner/contrib/", data, "#wordpair");
            this.startPageTimer();
        },
        timerTime: function () {
            return this.time;
        },
        next: function () {
            this.cancelPageTimer();
            this.nextState();
        }
    });

    return WordpairPage;
});
