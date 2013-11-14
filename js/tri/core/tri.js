define (["require", "jquery", "underscore", "yaml"], function (require, $, _, yaml) {
	"use strict";

	function getModule(name, type) {
		console.log("getModule: " + name + " " + type);

		// TODO: Cache this
		var modules = {"page": {}, "question": {}, "login": {}};
		var packages = YAML.load("config/packages.yaml").packages;
		// TODO: This code should be cleaned up

		function savePack(packageName) {
			// TODO: Make this generic beyond question/page/login
			console.log("opening js/" + packageName + "/package.yaml");
			var pack = YAML.load("js/" + packageName + "/package.yaml");
			console.log(pack);
			_.each(pack.page, function(packagePage) {
				modules.page[packagePage] = packageName;
			});
			_.each(pack.question, function(packageQuestion) {
				modules.question[packageQuestion] = packageName;
			});
			_.each(pack.login, function(packageLogin) {
				modules.login[packageLogin] = packageName;
			});
		}

		_.each(packages, function (pack, val) {
			console.log(pack); console.log(val);
			if (_.isObject(pack)) {
				_.each(pack, function (packageNames, parentPackageName) {
					console.log(parentPackageName);
					console.log(packageNames);
					_.each(packageNames, function (packageName) {
						savePack(parentPackageName + "/" + packageName);
					});
				});
			}
			else {
				savePack(pack);
			}
		})
		console.log("searching modules for " + type + " " + name);
		console.log("modules");
		console.log(modules);
		return modules[type][name] + "/" +  type + "/" + name;
	}

	function loadModule(name, type, callback) {
		var req = getModule(name, type);
		console.log("loading module: ", req);
        require([req], callback);
	}

	return {
		getModule: getModule,
		loadModule: loadModule
	}
});
