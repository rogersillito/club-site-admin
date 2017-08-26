var keystone = require('keystone');
var Types = keystone.Field.Types;
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/**
 * PostCategory Model
 * ==================
 */

// load list of available icons from our custom icomoon sass file
var iconPath = path.join(__dirname, '..', 'public', 'fonts', 'icomoon', '_icomoonStyle.scss');
var iconRegex = /^\.(icon-[^:]+):before/;
var icons = [];
fs.readFileSync(iconPath).toString().split(/\r?\n/).forEach(function(line){
  const m = iconRegex.exec(line);
  if (m) {
    icons.push(m[1]);
  }
});
var iconOptions = _.sortBy(icons, i => i).join(', ');
// console.log("icons = ", iconOptions);

var PostCategory = new keystone.List('PostCategory', {
	defaultSort: 'name',
	autokey: { from: 'name', path: 'key', unique: true }
});
PostCategory.add({
	name: { type: String, required: true },
  icon: { type: Types.Select, options: iconOptions, default: 'icon-file-text',
          note: `View icon gallery at: ${keystone.get('publicUrl')}/fonts/icomoon/demo.html`}
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.register();
