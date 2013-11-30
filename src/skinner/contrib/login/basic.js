define (["jquery"], function($) {
    "use strict";

    function BasicLogin(data) {
        this.data = data;
    }
    BasicLogin.prototype.start = function(callback) {
        $("#loginButton").click(function () {
            var subjectNumber = $("#subjectNumber").val();
            callback(subjectNumber);
        });
    };
    
    return BasicLogin;
});
