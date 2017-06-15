var keystone = require('keystone');
var middleware = require('../middleware');
var modelHelpers = require('../../lib/modelHelpers');

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

  var criteria = modelHelpers.publishedCriteria();
	
	// Load the current post
  var title;
  var overrideBanner;
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			// publishedState: 'published',
			slug: locals.filters.post
		})
    .where(criteria)
    .populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.post = result;
      if (result.bannerImage.url) {
	      overrideBanner = result.bannerImage.url;
      }
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
    //TODO: this ain't working right
    locals.pageTitle = `${locals.pageTitle}: ${title}`;
    if (overrideBanner) {
	    locals.bannerImage = overrideBanner;
    }
		
		var q = keystone.list('Post').model.find().where(criteria).sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
