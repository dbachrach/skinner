define(["lib/lodash"], function (_) {
    function keyPath(obj, path, defaultValue) {
        var foundValue;

        if (_.isString(path)) {
            foundValue = _.reduce(path.split("."), function (o, val) {
                if (!_.isUndefined(o) && o.hasOwnProperty(val)) {
                    return o[val];
                }
                else {
                    return undefined;
                }
                return o[val];
            }, obj);
        }

        if (_.isUndefined(foundValue)) {
            return defaultValue;
        }
        else {
            return foundValue;
        }
    }

    return keyPath;
});
