(function () {

    // TODO: Share this with the main.js

    // Configure RequireJS so it resolves relative module paths from the `src`
    // folder.
    requirejs.config({
        // baseUrl: "../src",
        baseUrl: "../src/skinner/core/vendor",
        paths: {
            "src": "../../..",
            "content": "../../../../content",
            "config": "../../../../config"
        },
        shim: {
            "Handlebars": {
                exports: "Handlebars"
            },
            "yaml": {
                exports: "YAML"
            }
        },
        map: {
          "*": { 
            "jquery": "jquery-private",
            "underscore": "underscore-private"
          },
          "jquery-private": { "jquery": "jquery" },
          "underscore-private": { "underscore": "underscore" }
        },

        urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
    });

    // A list of all QUnit test Modules.  Make sure you include the `.js` 
    // extension so RequireJS resolves them as relative paths rather than using
    // the `baseUrl` value supplied above.
    var testModules = [
        "skinner/core/intervalsTests.js",
        "skinner/core/experimentTests.js",
        "skinner/core/testPageTests.js",
        // "example/model/PegiRatingsTests.js"
    ];

    // Resolve all testModules and then start the Test Runner.
    require(testModules, function () {
        QUnit.load();
        QUnit.start();
    });
}());

