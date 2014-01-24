
module.exports = function (grunt) {
    "use strict";

    var walk = require("walk");

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

        // JSCS settings
        jscs: {
            src: ["gruntfile.js", "src/**/*.js", "test/**/*.js"],
            options: {
                config: ".jscs.json"
            }
        },

        // CSSLint settings
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
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
                    out: "release/src/main-built.js",
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
            all: ["tests/tests.html"]
        },

        removelogging: {
            dist: {
                src: "release/src/main-built.js",
            }
        },

        uglify: {
            my_target: {
                files: {
                    "release/src/main-built.js": ["release/src/main-built.js"]
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: ["config/**", "content/**", "css/**", "src/**"],
                        dest: "release/"
                    },
                    {
                        src: "index.html",
                        dest: "release/",
                    }
                ],
                options: {
                    process: function (content, srcpath) {
                        if (srcpath === "index.html") {
                            content = content.replace(/<script data-main="src\/main.js" src="lib\/require.js"><\/script>/, "<script src=\"src/main-built.js\"></script>");
                        }
                        return content;
                    },
                    noProcess: ["**/*.{png,gif,jpg,ico,svg,ttf,eot,woff,otf}"]
                }
            }
        }
    });

    // Load plugins
    require('load-grunt-tasks')(grunt);

    // Tasks
    grunt.registerTask("lint", ["jshint", "jscs", "csslint"]);
    grunt.registerTask("test", ["lint", "qunit"]);
    grunt.registerTask("build", ["initBuild", "copy", "requirejs", "removelogging", "uglify"]);
    grunt.registerTask("default", ["test", "build"]);

    // TODO: Optimize further to parse experiment.yaml and include page types and content and html?
    grunt.registerTask("initBuild", function () {
        var done = this.async();
        var files = [];

        function onFile(root, stat, next) {
            var filename = stat.name;
            var extension = ".js";
            if (filename.substring(filename.length - extension.length, filename.length) === extension) {
                if (filename !== "main.js") {
                    files.push(root.substring(2, root.length) + "/" + filename.substring(0, filename.length - extension.length));
                }
            }
            next();
        }

        var srcWalker = walk.walk("./src");
        srcWalker.on("file", onFile);
        srcWalker.on("end", function () {
            var libWalker = walk.walk("./lib");
            libWalker.on("file", onFile);
            libWalker.on("end", function () {
                grunt.config(["initBuildData"], files);
                done();
            });
        });
    });
};
