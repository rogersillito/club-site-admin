var keystone = require('keystone');
var Page = keystone.list('Page');
var modelHelpers = require('../../lib/modelHelpers');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('init', function(next) {
		// load, and add file attachments
		var q = keystone.list('Page').model.findOne({
			routePath: locals.page.routePath
		}, 'files')
		.populate('files');
		
		q.exec(function(err, result) {
			if (err) {
				return next(err);
			}
			locals.files = modelHelpers.transformFileUploads(result.files);
			return next();
		});
	});

	view.on('init', function(next) {
		// add image sources
		locals.images = [];
		[1,2,3].forEach(i => {
			const fieldName = 'image' + i;
			const image = modelHelpers.getLightboxSrcs(locals.page, fieldName);
			if (image) {
				locals.images.push(image);
			}
		});
		return next();
	});
  
  view.render('page');
};
