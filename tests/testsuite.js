(function () {

    requirejs.config({
        baseUrl: "../",
        shim: {
            "lib/Handlebars": {
                exports: "Handlebars"
            },
            "lib/pegjs": {
                exports: "PEG"
            }
        },
        map: {
          "*": {
            "lib/jquery": "lib/jquery-private",

            // Map loader plugins, so you don't have to include "lib/" prefix.
            "ryaml": "lib/ryaml",
            "domReady": "lib/domReady",
            "text": "lib/text",
            "css": "lib/css",
            "peg": "lib/peg",
            "hbars": "lib/hbars"
          },
          "lib/jquery-private": { "lib/jquery": "lib/jquery" },
        },

        urlArgs: "time=" + (new Date()).getTime() // for development to not cache scripts
    });

    // A list of all QUnit test Modules.  Make sure you include the `.js`
    // extension so RequireJS resolves them as relative paths rather than using
    // the `baseUrl` value supplied above.
    var testModules = [
        "skinner/core/experimentTests.js",
        "skinner/core/intervalsTests.js",
        "skinner/core/keypathTests.js",
        "skinner/core/pageTests.js",
        "skinner/core/QuestionTests.js",
        "skinner/core/resolverTests.js",
        "skinner/core/subjectTests.js",
        "skinner/core/testPageTests.js",
        "functional/dimensionsTests.js",
        "functional/simpleTextTests.js",
        "functional/simpleStepTests.js",
        "functional/repeatStepTests.js"
    ];

    // Resolve all testModules and then start the Test Runner.
    require(testModules, function () {
        QUnit.load();
        QUnit.start();
    });
}());

