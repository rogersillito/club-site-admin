var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * BasePage Model
 * ==========
 */

var BasePage = new keystone.List('BasePage', {
  map: { name: 'title' },
  hidden: true,
  autokey: { path: 'slug', from: 'title', unique: true }
});

BasePage.add({
  title: { type: String, required: true },
  slug: { type: String, readonly: true },
  publishedDate: { type: Date, default: Date.now },
  metaDescription: { type: String }
});

BasePage.register();

exports = module.exports = BasePage;  
