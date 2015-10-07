var flashcardFile = "ryaml!config/flashcards";

define (["lib/jquery", "src/skinner/core/page", "src/skinner/core/loader", "src/skinner/core/keypath", "src/skinner/core/intervals", flashcardFile], function ($, Page, loader, keyPath, intervals, allFlashcardData) {
    "use strict";

    var FlashcardPage = Page.extend({
        init: function (data, task) {
            this._super(data, task);

            this.flashcardSet = keyPath(this.data, "flashcard set");
            this.flashcardsData = allFlashcardData[this.flashcardSet];

            this.order = keyPath(this.data, "order");

            // TODO: These should fallback on this.time if not here
            this.timeFront = intervals.parseTimeInterval(keyPath(this.data, "time front"));
            this.timeBack = intervals.parseTimeInterval(keyPath(this.data, "time back"));

            if (this.order === "random") {
                this.flashcardsData = _.shuffle(this.flashcardsData);
            }

            this.currentFlashcardIndex = -1;

            this.autoStartPageTimer = false;
        },
        postShow: function () {
            this.nextState();
        },
        nextState: function () {
            this.currentFlashcardIndex++;

            if ((this.flashcardsData.length * 2) > this.currentFlashcardIndex) {
                this.showFlashcard(this.flashcardsData[Math.floor(this.currentFlashcardIndex / 2)]);
            }
            else {
                this.moveToNextPage();
            }
        },
        showFlashcard: function (data) {
            var layout;
            if (this.currentFlashcardIndex % 2 === 0) {
                layout = 'flashCardFront';
            }
            else {
                layout = 'flashCardBack';
            }
            loader.loadLayoutInPackage(layout, "src/skinner/contrib/", data, "#flashcard");
            this.startPageTimer();
        },
        timerTime: function () {
            if (this.currentFlashcardIndex % 2 === 0) {
                return this.timeFront;
            }
            else {
                return this.timeBack;
            }
        },
        next: function () {
            this.cancelPageTimer();
            this.nextState();
        }
    });

    return FlashcardPage;
});
