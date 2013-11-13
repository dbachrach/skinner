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

    var expData = YAML.load("config/experiment.yaml");
    var exp = new Experiment(expData);
    exp.begin();
});
