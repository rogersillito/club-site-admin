var keystone = require('keystone');
var middleware = require('../middleware');
var async = require('async');
var _ = require('underscore');
var modelHelpers = require('../../lib/modelHelpers');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.filters = {
		category: req.params.category
	};
  locals.filters.category = locals.filters.category.toLowerCase();
	locals.data = {
		posts: [],
		categories: []
	};

  var criteria = modelHelpers.publishedCriteria();

	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.categories = results;
			
			// Load the counts for each category
			async.each(locals.data.categories, function(category, next) {
				
				keystone.list('Post').model.count()
          .where('categories').in([category.id])
          .where(criteria)
          .exec(function(err, count) {
					category.postCount = count;
					next(err);
				});
				
			}, function(err) {
				next(err);
			});
		});
	});

  view.on('init', function(next) {
    middleware.setLocalsFromMatchingMenuLink(req, res, next);
  });
	
	// Load the current category filter
	view.on('init', function(next) {
		
		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
        if (!result) {
          return res.status(404).send(keystone.wrapHTMLError('Page Not Found', 'The page you were looking for does not exist.'));
        }
				locals.data.category = result;
				return next(err);
			});
		} else {
			next();
		}
	});
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
      .where(criteria)
			.sort('-publishedDate')
			.populate('author categories');
		
		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}
		
		q.exec(function(err, results) {
      if (err) { return next(err); }
      _.each(results.results, function(r) {
        r.category = locals.data.category.key;
      });
			locals.data.posts = results;
			return next();
		});
		
	});
	
	// Render the view
	view.render('posts');
	
};
