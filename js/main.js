requirejs.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app'
    },
    urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
});

require(["jquery", "yaml", "app/experiment"], function (jquery, yaml, Experiment) {
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    var expData = YAML.load("config/experiment.yaml");
	var exp = new Experiment(expData["pages"]);
	exp.begin();
});
