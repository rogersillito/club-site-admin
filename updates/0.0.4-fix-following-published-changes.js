var keystone = require('keystone'),
	  async = require('async'),
    Post = keystone.list('Post');
var Promise = require('es6-promise')
      .Promise;

exports = module.exports = function(done) {
	var q = Post.model.find().sort('publishedDate').exec((err, posts) => {
    if (err) done(err);
    const saveOps = [];
    for(var i = 0; i < posts.length; i++) {
      var p = posts[i];
      saveOps.push(new Promise((resolve, reject) => {
        var doc = p._doc;
        if (doc.state === 'published') {
          p.publishedState = doc.state;
          console.log("p.publishedState = ", p.publishedState);
        }
        p.title = 'X_' +p.title;
        p.save(function(err2) {
          if (err2) return reject(err);
          console.log("updated: ", p.title);
          return resolve(true);
        });
      }));
    }
    Promise.all(saveOps)
      .then(x => done())
      .catch(err => done(err));
  });
};
