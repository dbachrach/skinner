define (["require", "lib/jquery", "lib/underscore", "ryaml!config/packages", "lib/underscore.string"], function (require, $, _, packageData) {
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
                    var createdModules = {"page": {}, "question": {}, "login": {}};
                    _.each(arguments, function (pack, index) {
                        var packageName = packs[index];
                        _.each(pack.page, function(packagePage) {
                            createdModules.page[packagePage] = packageName;
                        });
                        _.each(pack.question, function(packageQuestion) {
                            createdModules.question[packageQuestion] = packageName;
                        });
                        _.each(pack.login, function(packageLogin) {
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

    function layoutPathForModule(modulePackage, name) {
        return "hbars!" + modulePackage + "layout/" + name;
    }

    function cssPathForModule(modulePackage, name) {
        return "css!" + modulePackage + "layout/" + name;
    }

    function loadLayout(name, type, bindings, selector, callback) {
        getModulePackage(name, type, function (modulePackage) {
            console.log("looking for layout `" + name + "` in module package `", modulePackage + "`");
            loadLayoutInPackage(name, modulePackage, bindings, selector, callback);
        });
    }

    function loadPageLayout(name, bindings, callback) {
        var fileSuffix = " file";
        function isFileBinding(/*value,*/ key) {
            return _.endsWith(key, fileSuffix);
        }
        function removeFileSuffix(key) {
            return key.slice(0, -(fileSuffix.length));
        }

        var contents = [];
        _.each(bindings, function (value, key) {
            if (isFileBinding(key)) {
                contents.push({ "path": "text!content/" + value + ".txt",
                                "binding": removeFileSuffix(key) });
            }
        });

        require(_.pluck(contents, "path"), function () {
            _.each(arguments, function (a, index) {
                bindings[contents[index].binding] = a;
            });

            loadLayout(name, "page", bindings, "#page", function () {
                if (callback) { callback(); }
            });
        });
    }

    function loadLayoutInPackage(name, pkg, bindings, selector, callback) {
        var layoutPath = layoutPathForModule(pkg, name);
        var cssPath = cssPathForModule(pkg, name);

        require([layoutPath, cssPath], function (template) {
            var result = template(bindings);
            $(selector).html(result);
            if (callback) {
                callback();
            }
        });
    }

    return {
        loadModule: loadModule,
        loadLayout: loadLayout,
        loadPageLayout: loadPageLayout,
        loadLayoutInPackage: loadLayoutInPackage
    };
});
