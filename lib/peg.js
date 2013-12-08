define(["lib/text", "lib/pegjs"], function (text, PEG) {
    var buildMap = {};
    var buildTemplateSource = "define('{pluginName}!{moduleName}', [], function () { return {content} });\n";

    return {
        version: '0.1.0',

        load: function(moduleName, parentRequire, onLoad, config) {
            var ext = (config.reqpeg && config.reqpeg.extension) || '.pegjs';
            var path = (config.reqpeg && config.reqpeg.path) || '';

            text.load(path + moduleName + ext, parentRequire, function (source) {
                if (config.isBuild) {
                    buildMap[moduleName] = PEG.buildParser(source).toSource();
                    onLoad();
                } else {
                    var parser = PEG.buildParser(source);
                    onLoad(parser);
                }
            }, config);
        },

        write: function (pluginName, moduleName, write, config) {
            var content = buildMap[moduleName];
            if (content) {
                write.asModule(pluginName + '!' + moduleName,
                    buildTemplateSource
                    .replace('{pluginName}', pluginName)
                    .replace('{moduleName}', moduleName)
                    .replace('{content}', content));
            }
        }
    }
});
