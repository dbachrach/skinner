

define(["text", "yaml"], function (text, YAML) {
    'use strict';

    var buildMap = {};
    var buildTemplateSource = "define('{pluginName}!{moduleName}', ['yaml'], function (YAML) { return YAML.parse({content}); });\n";

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
                        // TODO: ???
                        // We store the precompiled template so we can use the
                        // handlebars.runtime after build.
                        // buildMap[moduleName] = YAML.parse(source);
                        // Don't bother doing anything else during build.
                        onload();
                    } else {
                        // We store the compiled template for reuse
                        // console.log("Yaml");console.log(YAML);
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