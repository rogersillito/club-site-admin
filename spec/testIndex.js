global.chai = require('chai');
global.chaiAsPromised = require("chai-as-promised");
global.expect = global.chai.expect;

chai.use(global.chaiAsPromised);

require('./helpers/helpers.js');

// Load test suites
require('./lib/dateHelpers.spec.js');
require('./lib/meetingResultHelpers.spec.js');
require('./lib/utils.spec.js');

// keystone model tests
var keystone = require('keystone');
keystone.init({
  'name': 'club-site-admin'
});
keystone.import('../models');
keystone.mongoose.connect('localhost', 'test-db');
keystone.mongoose.connection.on('open', function() {

  // Run tests here

  // Use keystone.list('Key') to access Lists and execute queries
  // as you would in your main application
  require('./models/Page.spec.js');
});
