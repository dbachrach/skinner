define (["lib/jquery", "lib/lodash", "lib/underscore.string", "ryaml!config/packages", "src/skinner/core/mode"], function ($, _, _s, packageData, mode) {
    "use strict";

    var loadModuleDefinitions = function () {
        var modules;

        function ryamlify(p) {
            return "ryaml!src/" + p + "/_package";
        }

        function internalLoadModuleDefinitions(callback) {
            if (!_.isUndefined(modules)) {
                console.log("Early finding modules");
                callback(modules);
            }
            else {
                var packs = [];
                _.each(packageData.packages, function (pack) {
                    if (_.isObject(pack)) {
                        _.each(pack, function (packageNames, parentPackageName) {
                            _.each(packageNames, function (packageName) {
                                packs.push(parentPackageName + "/" + packageName);
                            });
                        });
                    }
                    else {
                        packs.push(pack);
                    }
                });

                require(_.map(packs, ryamlify), function () {
                    var createdModules = { "page": {}, "question": {}, "login": {} };
                    _.each(arguments, function (pack, index) {
                        var packageName = packs[index];
                        _.each(pack.page, function (packagePage) {
                            createdModules.page[packagePage] = packageName;
                        });
                        _.each(pack.question, function (packageQuestion) {
                            createdModules.question[packageQuestion] = packageName;
                        });
                        _.each(pack.login, function (packageLogin) {
                            createdModules.login[packageLogin] = packageName;
                        });
                    });

                    modules = createdModules;

                    callback(modules);
                });
            }
        }

        return internalLoadModuleDefinitions;
    }();

    function getModulePackage(name, type, callback) {
        loadModuleDefinitions(function (modules) {
            var modulePackage = "src" + "/" + modules[type][name] + "/" +  type + "/";
            callback(modulePackage);
        });
    }

    function loadModuleInPackage(name, pkg, callback) {
        var srcPath = srcPathForModule(pkg, name);
        require([srcPath], callback);
    }

    function loadModule(name, type, callback) {
        getModulePackage(name, type, function (modulePackage) {
            console.log("looking for `" + name + "` module in module package `", modulePackage + "`");
            loadModuleInPackage(name, modulePackage, callback);
        });
    }

    function srcPathForModule(modulePackage, moduleName) {
        return modulePackage + moduleName;
    }

    function rawLayoutPathForModule(modulePackage, name) {
        return modulePackage + "layout/" + name;
    }
    function layoutPathForModule(modulePackage, name) {
        return "hbars!" + rawLayoutPathForModule(modulePackage, name);
    }

    function rawCssPathForModule(modulePackage, name, includeExtension) {
        var extension = (includeExtension) ? ".css" : "";
        return modulePackage + "layout/" + name + extension;
    }
    function cssPathForModule(modulePackage, name) {
        return "css!" + rawCssPathForModule(modulePackage, name, false);
    }

    function loadLayout(name, type, bindings, selector, callback) {
        getModulePackage(name, type, function (modulePackage) {
            console.log("looking for layout `" + name + "` in module package `", modulePackage + "`");
            loadLayoutInPackage(name, modulePackage, bindings, selector, callback);
        });
    }

    function unloadLayout(name, type, callback) {
        getModulePackage(name, type, function (modulePackage) {
            unloadLayoutInPackage(name, modulePackage, callback);
        });
    }

    function expandBindings(bindings, callback) {
        var fileSuffix = " file";
        function isFileBinding(key) {
            return _s.endsWith(key, fileSuffix);
        }
        function removeFileSuffix(key) {
            return key.slice(0, -(fileSuffix.length));
        }

        // TODO: This is actually a filter() followed by a map()
        var contents = [];
        _.each(bindings, function (value, key) {
            if (isFileBinding(key)) {
                var contentPath = "content";
                if (mode.isTestMode()) {
                    contentPath = "tests/functional/content";
                }
                contents.push({ "path": "text!" + contentPath + "/" + value + ".html",
                                "binding": removeFileSuffix(key) });
            }
        });

        // TODO: Create a new instance of bindings
        require(_.pluck(contents, "path"), function () {
            _.each(arguments, function (a, index) {
                bindings[contents[index].binding] = a;
            });

            callback(bindings);
        });
    }

    function loadPageLayout(name, bindings, callback) {
        loadLayout(name, "page", bindings, "#page", callback);
    }

    function unloadPageLayout(name, callback) {
        unloadLayout(name, "page", callback);
    }

    function loadLayoutInPackage(name, pkg, bindings, selector, callback) {
        var layoutPath = layoutPathForModule(pkg, name);
        var cssPath = cssPathForModule(pkg, name);

        require([layoutPath, cssPath], function (template) {
            expandBindings(bindings, function (expandedBinds) {
                var result = template(expandedBinds);
                $(selector).html(result);
                if (callback) {
                    callback();
                }
            });
        });
    }

    function unloadLayoutInPackage(name, pkg, callback) {
        var rawCssPath = rawCssPathForModule(pkg, name, true);
        $("link[href='" + rawCssPath + "']").remove();

        var cssPath = cssPathForModule(pkg, name);
        requirejs.undef("lib/" + cssPath);

        if (callback) {
            callback();
        }
    }

    return {
        loadModule: loadModule,
        loadLayout: loadLayout,
        unloadLayout: unloadLayout,
        loadPageLayout: loadPageLayout,
        unloadPageLayout: unloadPageLayout,
        loadLayoutInPackage: loadLayoutInPackage,
        unloadLayoutInPackage: unloadLayoutInPackage
    };
});
