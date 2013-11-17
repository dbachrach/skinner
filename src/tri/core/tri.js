define (["require", "jquery", "underscore", "yaml"], function (require, $, _, YAML) {
    "use strict";

    if (!String.prototype.startsWith) {
      Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
          position = position || 0;
          return this.indexOf(searchString, position) === position;
        }
      });
    }

    function getModulePackage(name, type) {
        // TODO: Cache this
        var modules = {"page": {}, "question": {}, "login": {}};
        var packages = YAML.load("config/packages.yaml").packages;
        // TODO: This code should be cleaned up

        function savePack(packageName) {
            // TODO: Make this generic beyond question/page/login
            // console.log("opening src/" + packageName + "/package.yaml");
            var pack = YAML.load("src/" + packageName + "/package.yaml");
            // console.log(pack);
            _.each(pack.page, function(packagePage) {
                modules.page[packagePage] = packageName;
            });
            _.each(pack.question, function(packageQuestion) {
                modules.question[packageQuestion] = packageName;
            });
            _.each(pack.login, function(packageLogin) {
                modules.login[packageLogin] = packageName;
            });
        }

        _.each(packages, function (pack) {
            if (_.isObject(pack)) {
                _.each(pack, function (packageNames, parentPackageName) {
                    // console.log(parentPackageName);
                    // console.log(packageNames);
                    _.each(packageNames, function (packageName) {
                        savePack(parentPackageName + "/" + packageName);
                    });
                });
            }
            else {
                savePack(pack);
            }
        });
        // console.log("searching modules for `" + type + "` `" + name + "`");
        // console.log("modules");
        // console.log(modules);
        return "src" + "/" + modules[type][name] + "/" +  type + "/";
    }

    function loadModuleInPackage(name, pkg, callback) {
        var srcPath = srcPathForModule(pkg, name);
        require([srcPath], callback);
    }

    function loadModule(name, type, callback) {
        var modulePackage = getModulePackage(name, type);
        console.log("looking for `" + name + "` module in module package `", modulePackage + "`");
        return loadModuleInPackage(name, modulePackage, callback);
    }

    function srcPathForModule(modulePackage, moduleName) {
        return modulePackage + moduleName;
    }

    function layoutPathForModule(modulePackage, name) {
        return "hbars!" + modulePackage + "layout/" + name;
    }

    function loadLayout(name, type, bindings, selector, callback) {
        var modulePackage = getModulePackage(name, type);
        console.log("looking for layout `" + name + "` in module package `", modulePackage + "`");
        return loadLayoutInPackage(name, modulePackage, bindings, selector, callback);
    }

    function loadPageLayout(name, bindings, callback) {
        function isFileBinding(/*value,*/ key) {
            return key.endsWith("File"); 
        }
        function removeFileSuffix(key) {
            return key.slice(0, -("File".length));
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

        require([layoutPath], function (template) {
            var result = template(bindings);
            $(selector).html(result);
            if (callback) callback();
        });
    }

    return {
        "loadModule": loadModule,
        "loadLayout": loadLayout,
        "loadPageLayout": loadPageLayout,
        "loadLayoutInPackage" : loadLayoutInPackage
    };
});
