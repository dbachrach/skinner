var wordpairFile = "ryaml!config/wordpairs";

define (["lib/jquery", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", "src/skinner/core/intervals", wordpairFile], function ($, Page, loader, keyPath, intervals, allWordpairData) {
    "use strict";

    var WordpairPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            var aKey = keyPath(this.data, "aKey");
            var bKey = keyPath(this.data, "bKey");

            // This allows either a single `wordpair set` or a list of `wordpair sets` to be provided.
            // If multiple word pair sets are provided they are merged together.
            // Any conflicting entries are overriden (later values override earlier values).
            var wordpairSet = keyPath(this.data, "wordpair set");
            var wordpairSets = keyPath(this.data, "wordpair sets", [wordpairSet]);

            this.wordpairData = wordpairSets.reduce(function (acc, wordpairSet) {
                allWordpairData[wordpairSet]
                    .forEach(function (d) {
                        acc.push({
                            wordA: d[aKey],
                            wordB: d[bKey]
                        });
                    });
                return acc;
            }, []);

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
