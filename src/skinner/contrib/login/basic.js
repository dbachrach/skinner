define (["lib/jquery", "lib/class"], function ($, Class) {
    "use strict";

    var BasicLogin = Class.extend({
        init: function (data) {
            this.data = data;
        },
        start: function (callback) {
            function updateLoginButton() {
                if ($("#subjectNumber").val().trim().length === 0) {
                    $("#loginButton").prop("disabled", true);
                    $("#loginButton").addClass("disabled");
                }
                else {
                    $("#loginButton").prop("disabled", false);
                    $("#loginButton").removeClass("disabled");
                }
            }

            $("#loginButton").click(function () {
                if (!$("#loginButton").prop("disabled")) {
                    var number = $("#subjectNumber").val();
                    callback(number);
                }
            });

            $("#subjectNumber").keyup(function () {
                updateLoginButton();
            });

            updateLoginButton();
        }
    });

    return BasicLogin;
});
