var keystone = require('keystone');
var Types = keystone.Field.Types;
var striptags = require('striptags');
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');
var addPublishableBehaviours = require('../lib/publishableMixin.js');
var _ = require('underscore');


function wordLimit(text, limit) {
  var words =  text.replace(/\s+/g,' ').trim().split(' ');
  var limited = false;
  return _.reduce(words, function(m,word,i) {
    var isLast = i === words.length-1;
    if (i >= limit) {
      return (isLast && limited) ? m + '...' : m;
    }
    if (i === limit-1)  {
      limited = true;
    }
    return m + ' ' + word;
  },'').substr(1);
}

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

var summaryLimit = 60;
var folder = 'posts';
Post.add({
	title: { type: String, required: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true, required: true, initial: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150, note: 'If completed, this will display in the list of posts beneath the title - otherwise Content Extended will be limited to ' + summaryLimit + ' words and displayed in its place.' },
		summary: { type: String, watch: true, hidden: true, value: function() {
      if (!this.content || !this.content.brief)
        return '';
      if (this.content.brief.trim()) {
        return this.content.brief;
      }
      var extendedText = striptags(this.content.extended);
      return wordLimit(extendedText, summaryLimit);
    } },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
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
    var limited = wordLimit(stripped, summaryLimit);
    var unlimited = wordLimit(stripped, summaryLimit + 1);
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
