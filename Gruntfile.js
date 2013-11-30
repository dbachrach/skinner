module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Read package settings from `package.json`.
        pkg: grunt.file.readJSON('package.json'),

        // JSHint settings
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                ignores: ['src/skinner/core/vendor/*.js'],
                jshintrc: true
            }
        },

        // CSSLint settings
        csslint: {
            strict: {
                src: ['css/main.css', 'src/**/*.css']
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    // Tasks
    grunt.registerTask('default', ['jshint', 'csslint']);
};
