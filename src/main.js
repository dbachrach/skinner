(function () {
    requirejs.config({
        baseUrl: "src/skinner/core/vendor",
        paths: {
            // app: "../../../app",
            // skinner: "../../../skinner",
            // distr: "../../../distr"
            "src": "../../..",
            "content": "../../../../content",
            "config": "../../../../config"
        },
        shim: {
            "Handlebars": {
                exports: "Handlebars"
            },
            "yaml": {
                exports: "YAML"
            }
        },
        map: {
          "*": { 
            "jquery": "jquery-private",
            "underscore": "underscore-private"
          },
          "jquery-private": { "jquery": "jquery" },
          "underscore-private": { "underscore": "underscore" }
        },
        urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
    });

    require(["jquery", "src/skinner/core/experiment", "ryaml!config/experiment", "domReady!"], function ($, Experiment, expData) {
    	$.ajaxSetup ({
    	    cache: false // Disable caching of AJAX responses
    	});

        // TODO: This should go somewhere else, 
        // and also check the state of the experiment to let people leave when they are done
        // $(window).bind("beforeunload", function () {
        //     return "Are you sure you want to leave? The experiment is not completed yet.";
        // });

        var exp = new Experiment(expData);
        exp.begin();


    });
}());