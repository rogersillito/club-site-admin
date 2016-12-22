var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SiteConfig Model
 * ==========
 */

var adminName = 'Settings';
var SiteConfig = new keystone.List('SiteConfig', {
  nocreate: true,
  hidden: true,
  nodelete: true,
  sortable: false,
  singular: adminName,
  plural: adminName
});

SiteConfig.add({
	name: { type: Types.Text, required: true, index: true, note: 'The name of the site goes in the box above.' }
});

SiteConfig.schema.post('save', function(config) {
  //TODO: update keystone's siteConfig property after save! (a reusable method that also gets called on start?)
  console.log('config updated!');
});

// SiteConfig.defaultColumns = 'name, email, isAdmin';
SiteConfig.register();
