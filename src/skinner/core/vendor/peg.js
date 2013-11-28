
define(["text", "pegjs"], function (text, PEG) {
    return {
        load: function(moduleName, parentRequire, onLoad, config) {
            var ext = (config.reqpeg && config.reqpeg.extension) || '.pegjs';
            var path = (config.reqpeg && config.reqpeg.path) || '';

            text.load(path + moduleName + ext, parentRequire, function (source) {
                if (config.isBuild) {
                    // TODO: ???
                    // We store the precompiled template so we can use the
                    // handlebars.runtime after build.
                    // buildMap[moduleName] = YAML.parse(source);
                    // Don't bother doing anything else during build.
                    onload();
                } else {
                    var parser = PEG.buildParser(source);
                    onLoad(parser);
                }
            }, config);

            
        }
    }
});
