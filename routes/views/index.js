var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	view.on('init', function(next) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
    next();
  });

	// Render the view
	view.render('index');
	
};
