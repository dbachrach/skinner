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
        urlArgs: "bust=" + (new Date()).getTime()
    });

    // `main` dependencies: experiment
    require(["lib/jquery", "src/skinner/core/experiment", "ryaml!config/experiment", "domReady!"], function ($, Experiment, expData, domReady) {

        // TODO: This should go somewhere else,
        // and also check the state of the experiment to let people leave when they are done
        // $(window).bind("beforeunload", function () {
        //     return "Are you sure you want to leave? The experiment is not completed yet.";
        // });

        // Create a new experiment based on the data loaded from `experiment.yaml`, and begin.
        var exp = new Experiment(expData);
        exp.begin();
    });
}());
