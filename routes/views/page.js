var keystone = require('keystone');
var Page = keystone.list('Page');
var modelHelpers = require('../../lib/modelHelpers');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// add image sources
	locals.images = [];
	[1,2,3].forEach(i => {
		const fieldName = 'image' + i;
		const image = modelHelpers.getLightboxSrcs(locals.page, fieldName);
		if (image) {
			locals.images.push(image);
		}
	});
  
  view.render('page');
};
