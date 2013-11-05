requirejs.config({
    baseUrl: 'js/vendor',
    paths: {
        app: '../app'
    }
});
require(["jquery", "yaml", "app/experiment"], function(j, yaml, Experiment) {
    // TODO: Shouldn't need this in production
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    var expData = YAML.load("config/experiment.yaml");
	var exp = new Experiment(expData["pages"]);
	exp.begin();
});
