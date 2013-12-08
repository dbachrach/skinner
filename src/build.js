({
    name: "src/main",
    include: ["src/skinner/core/question"],
    out: "main-built.js",
    mainConfigFile: 'main.js',
    baseUrl: "../",
    optimize: "uglify",
    useStrict: true
})
