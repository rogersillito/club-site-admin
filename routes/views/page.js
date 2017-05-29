var keystone = require('keystone');
var Page = keystone.list('Page');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
  
  view.render('page');
};
