define (["lib/jquery", "lib/class"], function ($, Class) {
    "use strict";

    var BasicLogin = Class.extend({
        init: function (data) {
            this.data = data;
        },
        start: function (callback) {
            $("#loginButton").click(function () {
                var number = Math.floor(Math.random() * (100000000));
                callback(number);
            });
        }
    });

    return BasicLogin;
});
