import _ from 'lodash';

export default const keyPath = (obj, path, defaultValue) => {
  let foundValue;

  if (_.isString(path)) {
    foundValue = _.reduce(path.split("."), (o, val) => {
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
};
