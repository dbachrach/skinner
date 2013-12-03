(function () {

    // Configure RequireJS
    requirejs.config({
        baseUrl: "./",
        shim: {
            "lib/underscore": {
                exports: "_"
            },
            "lib/underscore.string": {
                deps: ["lib/underscore"],
                init: function(_) {
                    _.mixin(_.str.exports());
                }
            },
            "lib/Handlebars": {
                exports: "Handlebars"
            },
            "lib/yaml": {
                exports: "YAML"
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
        urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
    });

    // `main` dependencies: experiment
    require(["lib/jquery", "src/skinner/core/experiment", "ryaml!config/experiment", "domReady!"], function ($, Experiment, expData, domReady) {
        $.ajaxSetup ({
            cache: false // Disable caching of AJAX responses
        });

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
