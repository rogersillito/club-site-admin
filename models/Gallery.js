var keystone = require('keystone');
var Types = keystone.Field.Types;
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');
var addPublishableBehaviours = require('../lib/publishableMixin.js');

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Gallery.add({
	name: { type: String, required: true },
	images: { type: Types.CloudinaryImages }
});
addCloudinaryCleanupBehaviours(Gallery);
addPublishableBehaviours(Gallery);

Gallery.register();
