define (["require", "jquery", "underscore", "yaml", "core/subject"], function (require, $, _, yaml, Subject) {
	"use strict";

	function login(callback) {
		$("#main").load("layouts/login.html", function () {
			$("#loginButton").click(function () {
				var subject = new Subject($("#subjectNumber").val());
				callback(subject);
			});
		});
	}

	function getModule(name, type) {
		console.log("getModule: " + name + " " + type);

		// TODO: Cache this
		var modules = {"page": {}, "question": {}};
		var packages = YAML.load("config/packages.yaml").packages;
		// TODO: This code should be cleaned up
		_.each(packages, function (packageName) {
			var pack = YAML.load("js/" + packageName + "/package.yaml");
			_.each(pack.page, function(packagePage) {
				modules.page[packagePage] = packageName;
			});
			_.each(pack.question, function(packagePage) {
				modules.question[packagePage] = packageName;
			});
		})
		console.log("modules");
		console.log(modules);
		return modules[type][name] + "/" +  type + "/" + name;
	}

	function loadModule(name, type, callback) {
		var req = getModule(name, type);
        require([req], callback);
	}

	return {
		login: login,
		getModule: getModule,
		loadModule: loadModule
	}
});
