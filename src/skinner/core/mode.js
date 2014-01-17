
define([], function () {
    "use strict";

    function isTestMode() {
        var search = window.location.search;
        var matches = search.match(/test=([^&]*)&*/);
        if (matches && matches.length == 2) {
            if (matches[1] === "true") {
                return true;
            }
        }
        return false;
    }

    return {
        "isTestMode": isTestMode
    };
});
