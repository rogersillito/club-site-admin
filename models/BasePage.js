var keystone = require('keystone');
var Types = keystone.Field.Types;
var NavNode = require('./NavNode');


/**
 * BasePage Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
  // inherits: NavNode
});

BasePage.add({
  // publishedDate: { type: Date, default: Date.now },    // needed/relevant for all BasePages?
  // metaDescription: { type: String }
});

BasePage.register();

exports = module.exports = BasePage;  
