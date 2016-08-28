global.chai = require('chai');
global.chaiAsPromised = require("chai-as-promised");
global.expect = global.chai.expect;

chai.use(global.chaiAsPromised);

// Load test suites
require('./models/Page.spec.js');
require('./lib/dateHelpers.spec.js');
require('./lib/meetingResultHelpers.spec.js');
require('./lib/utils.spec.js');
