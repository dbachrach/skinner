define (["jquery", "underscore", "tri/core/subject"], function($, _, Subject) {
	"use strict";

	function BasicLogin(data) {
		this.data = data;
	}
	BasicLogin.prototype.start = function(callback) {
		$("#main").load("layouts/login_basic.html", function () {
		    $("#loginButton").click(function () {
		        var subject = new Subject($("#subjectNumber").val());
		        callback(subject);
		    });
		});
	};
	
	return BasicLogin;
});
