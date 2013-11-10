define (["jquery", "underscore", "yaml", "core/subject"], function ($, _, yaml, Subject) {
	"use strict";

	return {
		// use: function (packages) {
		// 	_.each(packages) {
				
		// 	}
		// }
		login: function (callback) {
			$("#main").load("layouts/login.html", function () {
				$("#loginButton").click(function () {
					var subject = new Subject($("#subjectNumber").val());
					callback(subject);
				});
			});
		},
		getModule: function (name, type) {
			console.log("getModule: " + name + " " + type);

			var modules = {"page": {}, "question": {}};
			var packages = YAML.load("config/packages.yaml").packages;
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
	}
});
