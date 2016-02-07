var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'results';

    // keystone.list('MeetingResult').model.find().exec(function(err, doc) {
    //     console.log(typeof(doc[0].dumpy)); 
    // });
	
	// Load the results by sortOrder
	view.query('results', keystone.list('MeetingResult').model.find().sort('sortOrder'));
	
	// Render the view
	view.render('results');
};
