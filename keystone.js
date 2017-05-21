// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')
  .load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');
// var MongoStore = require('connect-mongo');

var initSingletonModel = require('./lib/initSingletonModel.js');
var navigation = require('./lib/navigation.js');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var settings = {

  'name': 'club-site-admin',
  'brand': 'Low Fell Running Club', // set from siteconfig?

  'db name': process.env.OPENSHIFT_MONGODB_DB_URL ? 'site': 'club-site-admin',
  'session store': 'mongo',

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

};
keystone.init(settings);


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
  'site structure': ['home-pages', 'pages', 'menu-links'],
  'posts': ['posts', 'post-categories'],
  'results': 'meeting-results',
  'galleries': 'galleries',
  'enquiries': 'enquiries',
  'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server
keystone.start({
  onHttpServerCreated: function() {
    navigation.build();
  }
});
