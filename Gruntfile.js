module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Read package settings from `package.json`.
        pkg: grunt.file.readJSON('package.json'),

        // JSHint settings
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: true
            }
        },

        // CSSLint settings
        csslint: {
            strict: {
                src: ['css/main.css', 'src/**/*.css']
            }
        },

        // RequireJS settings
        requirejs: {
            compile: {
                options: {
                    name: "src/main",
                    include: ["src/skinner/core/question"],
                    out: "release/main-built.js",
                    mainConfigFile: 'src/main.js',
                    baseUrl: "./",
                    optimize: "uglify",
                    useStrict: true
                }
            }
        },

        // QUnit settings
        qunit: {
            all: ['tests/**/*.html']
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Tasks
    grunt.registerTask('lint', ['jshint', 'csslint']);
    grunt.registerTask('test', ['lint', 'qunit']);
    grunt.registerTask('default', ['test', 'requirejs']);
};
