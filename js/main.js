requirejs.config({
    baseUrl: "js/core/vendor",
    paths: {
        app: "../../app",
        core: "../",
        contrib: "../../contrib",
        distr: "../../distr"
    },
    map: {
      "*": { "jquery": "jquery-private", "underscore": "underscore-private" },
      "jquery-private": { "jquery": "jquery" },
      "underscore-private": { "underscore": "underscore" }
    },
    urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
});

require(["jquery", "yaml", "core/tri", "core/experiment"], function ($, yaml, tri, Experiment) {
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    tri.login(function (subject) {
        console.log("Subject Number " + subject + " logged in");

        var expData = YAML.load("config/experiment.yaml");
        var exp = new Experiment(expData["pages"], subject);
        exp.begin();
    });
});
