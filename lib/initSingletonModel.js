var Promise = require('es6-promise')
  .Promise;

var initSingletonModel = function(keystone, modelName, newInstanceProps) {
  return new Promise(function(resolve, reject) {
    var SingletonList = keystone.list(modelName);
    SingletonList.model.findOne()
      .exec(function(err, result) {
        if (err) {
          // as this runs on app start, treat errors as fatal
          throw err;
        }
        var singletonInstance;
        if (!result) {
          console.log('Initialising ' + modelName + '...');
          singletonInstance = new SingletonList.model(newInstanceProps);
          singletonInstance.save(function(err) {
            if (err) {
              throw new Error('Failed to initialise ' + modelName + ': ' +
                err);
            }
            console.log(modelName + ' initialised.');
          });
        } else {
          console.log(modelName + ' instance already exists.');
          singletonInstance = result;
        }
        resolve(singletonInstance);
      });
  });
};

exports = module.exports = initSingletonModel;
