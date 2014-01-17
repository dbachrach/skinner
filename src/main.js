(function () {

    // Configure RequireJS
    requirejs.config({
        baseUrl: "./",
        shim: {
            "lib/Handlebars": {
                exports: "Handlebars"
            },
            "lib/pegjs": {
                exports: "PEG"
            }
        },
        map: {
            "*": {
                "lib/jquery": "lib/jquery-private",

                // Map loader plugins, so you don't have to include "lib/" prefix.
                "ryaml": "lib/ryaml",
                "domReady": "lib/domReady",
                "text": "lib/text",
                "css": "lib/css",
                "peg": "lib/peg",
                "hbars": "lib/hbars"
            },
            "lib/jquery-private": { "lib/jquery": "lib/jquery" },
        },

        // Bust cache during development,
        // so a refresh in the browser gets the latest code.
        // TODO: Strip in production
        urlArgs: "bust=" + (new Date()).getTime()
    });


    // `main` dependencies: experiment
    require(["lib/jquery", "domReady!", "src/skinner/core/experiment", "src/skinner/core/mode"], function ($, domReady, Experiment, mode) {
        var configFile = "ryaml!config/experiment";
        if (mode.isTestMode()) {
            var search = window.location.search;
            var matches = search.match(/config=([^&]*)&*/);
            if (matches && matches.length === 2) {
                configFile = "ryaml!tests/functional/configs/" + matches[1];
            }
        }

        require([configFile], function (expData) {
            // Create a new experiment based on the data loaded from `experiment.yaml`, and begin.
            var exp = new Experiment(expData);
            exp.begin();
        });
    });
}());
