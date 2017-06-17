var keystone = require('keystone');
var Types = keystone.Field.Types;
var striptags = require('striptags');
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');
var addPublishableBehaviours = require('../lib/publishableMixin.js');
var _ = require('underscore');
var modelHelpers = require('../lib/modelHelpers');

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

var summaryLimit = 50;
var folder = 'posts';
Post.add({
	title: { type: String, required: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true, required: true, initial: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150, note: 'If completed, this will display in the list of posts beneath the title - otherwise Content Extended will be limited to ' + summaryLimit + ' words and displayed in its place.' },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
		summary: { type: String, watch: true, hidden: true, value: function() {
      if (!this.content.extended && !this.content.brief)
        return '';
      if (this.content.brief.trim()) {
        return this.content.brief;
      }
      var extendedText = striptags(this.content.extended);
      return '<p>' + modelHelpers.wordLimit(extendedText, summaryLimit) + '</p>';
    } }
	},
	bannerImage: { type: Types.CloudinaryImage, autoCleanup: true, folder: 'banners',
                 note: 'The image uploaded will be used as the main banner image in the template header of this page/section' },
	image1: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
	image2: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  },
	image3: { type: Types.CloudinaryImage, autoCleanup: true, folder: folder  }
});

addCloudinaryCleanupBehaviours(Post);
addPublishableBehaviours(Post);

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.schema.pre('save', function(next) {
  if (!this.content || !this.content.brief) {
    return next();
  }
  var contentBrief = this.content.brief.trim();
  if (contentBrief) {
    var stripped = striptags(contentBrief);
    var limited = modelHelpers.wordLimit(stripped, summaryLimit);
    var unlimited = modelHelpers.wordLimit(stripped, summaryLimit + 1);
    // console.log("unlimited = ", unlimited);
    // console.log("limited = ", limited);
    if (limited !== unlimited) {
      return next(new Error('Content Brief should not be longer than ' + summaryLimit + ' words.'));
    }
  }
  return next();
});

Post.defaultColumns = 'title|30%, categories|20%, state, author, publishedDate';
// Post.defaultSort = 'title, categories, state, author, publishedDate';
Post.register();
