var keystone = require('keystone'),
	  async = require('async'),
    HomePage = keystone.list('HomePage');
var Promise = require('es6-promise')
      .Promise;

exports = module.exports = function(done) {
	var q = HomePage.model.find().exec((err, results) => {
    if (err) done(err);
    const saveOps = [];
    for(var i = 0; i < results.length; i++) {
      saveOps.push(new Promise((resolve, reject) => {
        results[i].save(function(err2) {
          if (err2) return reject(err);
          console.log("updated homepage");
          return resolve(true);
        });
      }));
    }
    Promise.all(saveOps)
      .then(x => done())
      .catch(err => done(err));
  });
};
