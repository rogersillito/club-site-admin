var keystone = require('keystone');
var Types = keystone.Field.Types;
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');
var addPublishableBehaviours = require('../lib/publishableMixin.js');
var striptags = require('striptags');
var modelHelpers = require('../lib/modelHelpers');
var _ = require('underscore');

/**
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	defaultSort: '-publishedDate',
	autokey: { from: 'name', path: 'key', unique: true }
});

var summaryLimit = 50;
Gallery.add({
	name: { type: String, required: true },
	description: { type: Types.Html, wysiwyg: true, height: 150, note: 'This will display in the list of galleries beneath the name (max ' + summaryLimit + ' words).' },
	bannerImage: { type: Types.CloudinaryImage, autoCleanup: true, folder: 'banners',
                 note: 'The image uploaded will be used as the main banner image in the template header of this page/section' },
	images: { type: Types.CloudinaryImages, folder: 'galleries', label: 'Gallery Images' },
	thumbnailSrc: { type: String, hidden: true }
});
addCloudinaryCleanupBehaviours(Gallery);
addPublishableBehaviours(Gallery);

Gallery.schema.pre('save', function(next) {
	// set thumbnail url
  this.thumbnailSrc = undefined;
  const namedTransform = 'media_lib_thumb';
  if (this.bannerImage.url) {
    this.thumbnailSrc = modelHelpers.getCloudinarySrc(this._.bannerImage.src, namedTransform);
  }
  else if (this.images.length) {
    // just use the first gallery image
    const firstIm = _.first(this.images);
    this.thumbnailSrc = modelHelpers.getCloudinarySrc(firstIm.src.bind(firstIm), namedTransform);
  }
	next();
});

Gallery.schema.pre('save', function(next) {
  if (!this.description) {
    return next();
  }
  var description = this.description.trim();
  var stripped = striptags(description);
  var limited = modelHelpers.wordLimit(stripped, summaryLimit);
  var unlimited = modelHelpers.wordLimit(stripped, summaryLimit + 1);
  // console.log("unlimited = ", unlimited);
  // console.log("limited = ", limited);
  if (limited !== unlimited) {
    return next(new Error('Description should not be longer than ' + summaryLimit + ' words.'));
  }
  return next();
});

Gallery.defaultColumns = 'name, publishedState, publishedDate';
Gallery.register();
