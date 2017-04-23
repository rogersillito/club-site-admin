var keystone = require('keystone');
var Types = keystone.Field.Types;
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	images: { type: Types.CloudinaryImages }
});
addCloudinaryCleanupBehaviours(Gallery);

Gallery.register();
