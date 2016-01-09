var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'results';
	locals.filters = {
		result: req.params.result
	};
	locals.data = {
		results: []
	};
	
	// Load the current result
	view.on('init', function(next) {
		
		var q = keystone.list('MeetingResult').model.findOne({
			state: 'published',
			slug: locals.filters.result
		}).populate('author categories');
		
		q.exec(function(err, result) {
			locals.data.result = result;
			next(err);
		});
		
	});
	
	// Load other results
	view.on('init', function(next) {
		
		var q = keystone.list('Result').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.results = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('result');
	
};
