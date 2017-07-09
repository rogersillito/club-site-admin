global.chai = require('chai');
global.chaiAsPromised = require("chai-as-promised");
global.expect = global.chai.expect;

chai.use(global.chaiAsPromised);

require('./helpers/helpers.js');

// Load test suites
require('./lib/dateHelpers.spec.js');
require('./lib/utils.spec.js');
require('./lib/modelHelpers.spec.js');

// keystone model tests
var keystone = require('keystone');
keystone.init({
  'name': 'club-site-admin'
});

// set arbitrary cloudinary url to avoid error
keystone.set('cloudinary config', 'cloudinary://111111111111111:-ABCABCABCABCABCABCABCABCAB@lfrc');

keystone.import('../models');
keystone.mongoose.connect('localhost', 'test-db');
keystone.mongoose.connection.on('open', function() {

  // Run tests here
  // NB: mocha doesn't appear to see any tests if only these callback-wrapped ones above!

  // Use keystone.list('Key') to access Lists and execute queries
  // as you would in your main application
  require('./lib/meetingResultHelpers.spec.js');
  require('./models/Page.spec.js');
  require('./models/MenuLink.spec.js');
});
