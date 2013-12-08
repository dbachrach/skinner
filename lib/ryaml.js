define(["lib/text", "lib/yaml"], function (text, YAML) {
    'use strict';

    var buildMap = {};
    var buildTemplateSource = "define('{pluginName}!{moduleName}', [], function () { return {content}; });\n";

    return {
        version: '0.1.0',

        load: function (moduleName, parentRequire, onload, config) {
            if (buildMap[moduleName]) {
                onload(buildMap[moduleName]);

            } else {
                var ext = (config.reqyaml && config.reqyaml.extension) || '.yaml';
                var path = (config.reqyaml && config.reqyaml.path) || '';

                text.load(path + moduleName + ext, parentRequire, function (source) {
                    if (config.isBuild) {
                        buildMap[moduleName] = JSON.stringify(YAML.parse(source));
                        onload();
                    } else {
                        buildMap[moduleName] = YAML.parse(source);
                        onload(buildMap[moduleName]);
                    }
                }, config);
            }
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
    };
});
