// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')
  .load();

// Require keystone
var keystone = require('keystone');
var mongoose = require('mongoose');
var handlebars = require('express-handlebars');
// var MongoStore = require('connect-mongo');

var initSingletonModel = require('./lib/initSingletonModel.js');
var navigation = require('./lib/navigation.js');
var fs = require('fs');
const path = require('path');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var settings = {

  'name': 'Club Site Admin',
  'brand': 'Low Fell Running Club', // set from siteconfig?
  'publicUrl': 'https://www.lowfellrunningclub.co.uk',

  'db name': 'site',
  'session store': 'mongo',
  'session store options': {
		// https://github.com/jdesboeufs/connect-mongo#session-expiration
		ttl: 4 * (24*60*60) 
		// 4 days (default = 14 days)
		// reduce session record life to manage db usage; given that openshift/haproxy
		// health checks result in a lot of session records being created...
	},
  'session': true,
  'auth': true,
  'user model': 'User',

	'compress': true,
  'static': 'public',
  'favicon': '/public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'hbs',

  'custom engine': handlebars.create({
      layoutsDir: 'templates/views/layouts',
      partialsDir: 'templates/views/partials',
      defaultLayout: 'default',
      helpers: new require('./templates/views/helpers')(),
      extname: '.hbs'
    })
    .engine,

  'auto update': true

};
keystone.init(settings);

// Load your project's Models
keystone.import('models');

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _: require('underscore'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
});

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  'site structure': ['home-pages', 'pages', 'menu-links'],
  'posts': ['posts', 'post-categories'],
  'results': 'meeting-results',
  'galleries': 'galleries',
  'enquiries': 'enquiries',
  'files': 'file-uploads',
	'settings': ['site-configs','users']
});


const jsVerPath = path.resolve(__dirname, '.jsBuildVersion');
var jsVersion = 1;
if (fs.existsSync(jsVerPath)) {
	jsVersion = fs.readFileSync(jsVerPath).toString();
}
keystone.set('jsVersion', jsVersion);

function updateSettingsWithSiteConfig() {
	var q = keystone.list('SiteConfig').model.findOne();
	q.exec(function(err, siteConfig){
		if (err) {
			return console.error(err);
		}
		return siteConfig.syncSettings();
	});
}

// Start Keystone to connect to your database and initialise the web server
keystone.start({
  onHttpServerCreated: function() {
    navigation.build();
		updateSettingsWithSiteConfig();
  }
});
