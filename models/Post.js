var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true, required: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage, autoCleanup: true, folder: 'posts'  },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
    //TODO: make this a watch field that word restricts, respecting html
		// brief: { type: Types.Html, watch: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	}
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title|30%, categories|20%, state, author, publishedDate';
// Post.defaultSort = 'title, categories, state, author, publishedDate';
Post.register();
