define (["jquery", "underscore", "core/subject"], function ($, underscore, Subject) {
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
			//"core/page/" + pageData.type + "Page"
			console.log("getModule: " + name + " " + type);
			var modules = {
				"page": { "test": "core", "text": "core", "distractor": "contrib", "countdown": "contrib" },
				"question": { "cuedRecall": "contrib", "multipleChoice": "contrib", "triangle": "app" }
			};
			return modules[type][name] + "/" +  type + "/" + name;
		}
	}
});
