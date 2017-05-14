/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var keystone = require('keystone');
var _ = require('underscore');
var Handlebars = require('handlebars');


//TODO: see handlebarsjs.com/block_helpers.html  - need to build a block helper to return the month entries for a given year
//      may also need to put the months into a subproperty of menu = { years: [], months: {} }
//      alternatively does the with block helper mean I can get away without registering a custom helper??
Handlebars.registerHelper('lookupProp', function (obj, key, prop) {
    return obj[key] && obj[key][prop];
});


/**
 Inits the error handler functions into `res`
 */
exports.initErrorHandlers = function(req, res, next) {
  res.err = function(err, title, message) {
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    });
  };

  res.notfound = function(title, message) {
    res.status(404).render('errors/404', {
      errorTitle: title,
      errorMsg: message
    });
  };
  next();
};


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;

  locals.navigation = keystone.get('navigation');

	locals.user = req.user;

	locals.siteName = 'Low Fell Running Club';
	
	locals.user = req.user;

	locals.bannerImage = 'http://placehold.it/1300x400/eeeeee/png/?text=Banner+Image+Goes+Here';

  // use homepage banner as default (if exists)
  var q = keystone.list('HomePage').model.findOne({
    level: 0
  });
  q.exec(function(err, home){
    if (err) {
      return next(err);
    }
    if (home.bannerImage.url) {
	    res.locals.bannerImage = home.bannerImage.url;
    }
	  return next();
  });
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};
