requirejs.config({
    baseUrl: 'js/core/vendor',
    paths: {
        app: '../../app',
        core: '../',
        contrib: '../../contrib'
    },
    map: {
      '*': { 'jquery': 'jquery-private' },
      'jquery-private': { 'jquery': 'jquery' }
    },
    urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
});

require(["jquery", "yaml", "core/tri", "core/experiment"], function ($, yaml, tri, Experiment) {
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    tri.login(function (subjectNumber) {
        console.log("Subject Number " + subjectNumber + " logged in");
        // var packageData = YAML.load("config/packages.yaml");
        // tri.use(packageData["packages"]);

        var expData = YAML.load("config/experiment.yaml");
        var exp = new Experiment(expData["pages"]);
        exp.begin();
    });
});
