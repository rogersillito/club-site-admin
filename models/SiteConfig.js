var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * SiteConfig Model
 * ==========
 */

var adminName = 'Settings';
var SiteConfig = new keystone.List('SiteConfig', {
  nocreate: true,
  nodelete: true,
  sortable: false,
  singular: adminName,
  plural: adminName
});

SiteConfig.add({
	name: { type: Types.Text, required: true, index: true }
});

// SiteConfig.defaultColumns = 'name, email, isAdmin';
SiteConfig.register();
