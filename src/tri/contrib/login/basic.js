define (["jquery", "underscore", "src/tri/core/subject"], function($, _, Subject) {
	"use strict";

	function BasicLogin(data) {
		this.data = data;
	}
	BasicLogin.prototype.start = function(callback) {
	    $("#loginButton").click(function () {
	        var subject = new Subject($("#subjectNumber").val());
	        callback(subject);
	    });
	};
	
	return BasicLogin;
});
