var keystone = require('keystone');
var middleware = require('../middleware');
var modelHelpers = require('../../lib/modelHelpers');
var _ = require('underscore');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	const locals = res.locals;
	const key = req.params.gallery;

  view.on('init', function(next) {
		const publishedCriteria = modelHelpers.publishedCriteria();
		const q = keystone.list('Gallery').model.findOne({
			key: key
		}).where(publishedCriteria);
		q.exec(function(err, result) {
			if (!result) {
				return res.sendNotFoundResponse();
			}
			locals.images = modelHelpers.getManyLightboxSrcs(result, 'images');
			locals.description = result.description;
			locals.publishedDateString = result.publishedDateString;
			locals.pageTitle = `${result.name} <small><strong>Gallery</strong></small>`;

			// set banner image
      if (result.bannerImage.url) {
	      locals.bannerImage = modelHelpers.protocolRelativeUrl(result.bannerImage.url);
      } else if (locals.images.length) {
				locals.bannerImage = locals.images[0].large;
			}

			return next();
		});
	});

	// Render the view
	view.render('gallery');
};
