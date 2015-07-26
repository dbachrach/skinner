define (["lib/jquery", "lib/class"], function ($, Class) {
    "use strict";

    var EmailLogin = Class.extend({
        init: function (data) {
            this.data = data;
        },
        start: function (callback) {
            function updateLoginButton() {
                if ($("#emailAddress").val().trim().length === 0) {
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
                    var email = $("#emailAddress").val();
                    var max = 10000;
                    var min = 1;
                    var number = Math.floor(Math.random() * (max - min + 1)) + min;
                    callback(number, email);
                }
            });

            $("#emailAddress").keyup(function () {
                updateLoginButton();
            });

            updateLoginButton();
        }
    });

    return EmailLogin;
});
