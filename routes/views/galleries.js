var keystone = require('keystone');
var middleware = require('../middleware');
var modelHelpers = require('../../lib/modelHelpers');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
  view.on('init', function(next) {
    var criteria = modelHelpers.publishedCriteria();
		var projection = 'key name description publishedDateString thumbnailSrc';
		keystone.list('Gallery').model.find(criteria, projection).sort('-publishedDate').exec(function(err, results) {
      if (err) {
				return next(err);
			}
			locals.galleries = results.map(g => {
				g.img = g.thumbnailSrc;
        g.link = '/gallery/' + g.key;
				return g;
			});
			return next();
		});
	});

  view.on('init', function(next) {
    middleware.setLocalsFromMatchingMenuLink(req, res, next);
  });
	
	// Render the view
	view.render('galleries');
	
};
