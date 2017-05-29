var keystone = require('keystone');
var middleware = require('../middleware');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'gallery';
	
	// Load the galleries by sortOrder
	view.query('galleries', keystone.list('Gallery').model.find().sort('sortOrder'));

  //TODO: set title for selected gallery!
  view.on('init', function(next) {
    middleware.setLocalsFromMatchingMenuLink(req, res, next);
  });
	
	// Render the view
	view.render('gallery');
	
};
