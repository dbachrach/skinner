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

require(["jquery", "yaml", "tri/core/tri", "tri/core/subject", "tri/core/experiment"], function ($, yaml, tri, Subject, Experiment) {
	$.ajaxSetup ({
	    cache: false // Disable caching of AJAX responses
	});

    function login(callback) {
        // TODO: Look for login type
        $("#main").load("layouts/login.html", function () {
            $("#loginButton").click(function () {
                var subject = new Subject($("#subjectNumber").val());
                callback(subject);
            });
        });
    }

    function experiment(subject) {
        var expData = YAML.load("config/experiment.yaml");
        var exp = new Experiment(expData["pages"], subject);
        exp.begin();
    }

    login(function (subject) {
        console.log("Subject Number " + subject + " logged in");

        experiment(subject);
    });
});
