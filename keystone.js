// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')
  .load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

var initSingletonModel = require('./lib/initSingletonModel.js');
var navigation = require('./lib/navigation.js');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

  'name': 'club-site-admin',
  'brand': 'club-site-admin',

  'sass': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
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

  'auto update': true,
  'session': true,
  'auth': true,
  'user model': 'User'

}); 


// keystone.set('wysiwyg additional plugins', 'table');
// keystone.set('wysiwyg additional options', {menubar: 'table'});

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
  'posts': ['posts', 'post-categories'],
  'results': 'meeting-results',
  'galleries': 'galleries',
  'enquiries': 'enquiries',
  'users': 'users'
});

// initialise (public) site navigation
navigation.build();

// Ensure site config and home page are initialised
initSingletonModel(keystone, 'SiteConfig', {
  name: 'Club Site'
}).then(function(siteConfig) {

  initSingletonModel(keystone, 'HomePage', {
    title: 'Home',
    isPublished: true
  }).then(function name(homePage) {

    // make settings configured in the admin UI available
    keystone.set('siteConfig', siteConfig);
    console.log('keystone using SiteConfig.');

  });
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
