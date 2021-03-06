var keystone = require('keystone');
var middleware = require('../middleware');
var modelHelpers = require('../../lib/modelHelpers');
var _ = require('underscore');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		category: req.params.category
	};

  var publishedCriteria = modelHelpers.publishedCriteria();
	
	// Load the current post
  var title;
  var overrideBanner;
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			slug: locals.filters.post
		})
    .where(publishedCriteria)
    .populate('author categories files');
		
		q.exec(function(err, result) {
      if (!result) {
				return res.sendNotFoundResponse();
      }
			locals.data.post = result;
      locals.data.category = _.find(result.categories, c => c.key == locals.data.category);
      if (!locals.data.category) {
				return res.sendNotFoundResponse();
      }
      if (result.bannerImage.url) {
				overrideBanner = modelHelpers.protocolRelativeUrl(result.bannerImage.url);
      }
			// add file attachments
			locals.data.files = modelHelpers.transformFileUploads(result.files);

			// add image sources
			locals.data.images = [];
			[1,2,3].forEach(i => {
				const fieldName = 'image' + i;
				const image = modelHelpers.getLightboxSrcs(result, fieldName);
				if (image) {
					locals.data.images.push(image);
				}
			});
      title = result.title;
			next(err);
		});
		
	});

  view.on('init', function(next) {
    // set banner image - we'll override title in a sec..
    middleware.setLocalsFromMatchingMenuLink({originalUrl: '/posts/'+req.params.category}, res, next);
  });
	
	// Load other posts
	view.on('init', function(next) {
    locals.pageTitle = `${title} <small><strong>${locals.pageTitle}</strong></small>`; // category as subheading!
    if (overrideBanner) {
	    locals.bannerImage = overrideBanner;
    }
		
		var q = keystone.list('Post').model.find().where(publishedCriteria).sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
