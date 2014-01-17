var walk = require("walk");

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Holder for init build data
        initBuildData: [],

        // Read package settings from `package.json`.
        pkg: grunt.file.readJSON("package.json"),

        // JSHint settings
        jshint: {
            files: ["gruntfile.js", "src/**/*.js", "test/**/*.js"],
            options: {
                jshintrc: true
            }
        },

        // TODO: Add back:
        /*
            "validateJSDoc": {
            "checkParamNames": true,
            "requireParamTypes": true
            },
        */
        // JSCS settings
        jscs: {
            src: ["gruntfile.js", "src/**/*.js", "test/**/*.js"],
            options: {
                config: ".jscs.json"
            }
        },

        // CSSLint settings
        csslint: {
            strict: {
                src: ["css/main.css", "src/**/*.css"]
            }
        },

        // RequireJS settings
        requirejs: {
            compile: {
                options: {
                    name: "src/main",
                    include: "<%= initBuildData %>",
                    out: "release/src/main.js",
                    mainConfigFile: "src/main.js",
                    baseUrl: "./",
                    optimize: "none",
                    useStrict: true,
                    findNestedDependencies: true,
                    onBuildWrite: function (name, path, contents) {
                        contents = contents.replace(/\/\*\! __BEGIN_REMOVE_FROM_PRODUCTION__ \*\/[\s\S]*?\/\*\! __END_REMOVE_FROM_PRODUCTION__ \*\//, "");
                        return contents;
                    }
                }
            }
        },

        // QUnit settings
        qunit: {
            all: ["tests/**/*.html"]
        },

        removelogging: {
            dist: {
                src: "release/src/main.js",
            }
        },

        uglify: {
            my_target: {
                files: {
                    "release/src/main.js": ["release/src/main.js"]
                }
            }
        },

        copy: {
            main: {
                files: [
                    { expand: true, src: ["config/**", "content/**", "css/**", "lib/**", "src/**", "index.html"], dest: "release/" }
                ]
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs-checker");
    grunt.loadNpmTasks("grunt-contrib-csslint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");

    // Tasks
    grunt.registerTask("lint", ["jshint", "jscs", "csslint"]);
    grunt.registerTask("test", ["lint", "qunit"]);
    grunt.registerTask("build", ["initBuild", "copy", "requirejs", "removelogging", "uglify"]);
    grunt.registerTask("default", ["test", "build"]);

    // TODO: Optimize further to parse experiment.yaml and include page types and content and html and maybe css.js and hbars.js?
    grunt.registerTask("initBuild", function () {
        var done = this.async();
        var files = [];

        var walker = walk.walk("./src");
        walker.on("file", function (root, stat, next) {
            var filename = stat.name;
            var extension = ".js";
            if (filename.substring(filename.length - extension.length, filename.length) === extension) {
                if (filename !== "main.js") {
                    files.push(root.substring(2, root.length) + "/" + filename.substring(0, filename.length - extension.length));
                }
            }
            next();
        });
        walker.on("end", function () {
            grunt.config(["initBuildData"], files);
            done();
        });
    });
};
