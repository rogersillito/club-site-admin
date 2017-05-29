var keystone = require('keystone');
var middleware = require('../middleware');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	// locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		category: req.params.category
	};
	
	// Load the current post
  var title;
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.post = result;
      title = `${result.title} (${req.params.category})`;
			next(err);
		});
		
	});

  view.on('init', function(next) {
    // set banner image - we'll override title in a sec..
    middleware.setLocalsFromMatchingMenuLink({originalUrl: '/posts/'+req.params.category}, res, next);
  });
	
	// Load other posts
	view.on('init', function(next) {
    locals.pageTitle = title;
		
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('post');
	
};
