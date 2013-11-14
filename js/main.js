requirejs.config({
    baseUrl: "js/tri/core/vendor",
    paths: {
        app: "../../../app",
        tri: "../../../tri",
        distr: "../../../distr"
    },
    map: {
      "*": { "jquery": "jquery-private", "underscore": "underscore-private" },
      "jquery-private": { "jquery": "jquery" },
      "underscore-private": { "underscore": "underscore" }
    },
    urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
});

require(["jquery", "yaml", "tri/core/experiment"], function ($, yaml, Experiment) {
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    // TODO: This should go somewhere else, 
    // and also check the state of the experiment to let people leave when they are done
    $(window).bind("beforeunload", function () {
        return "Are you sure you want to leave? The experiment is not completed yet.";
    });

    var expData = YAML.load("config/experiment.yaml");
    var exp = new Experiment(expData);
    exp.begin();
});
