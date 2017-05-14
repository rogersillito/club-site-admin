var keystone = require('keystone');
var Types = keystone.Field.Types;
var addCloudinaryCleanupBehaviours = require('../lib/addCloudinaryCleanupBehaviours.js');

/**
 * NavNode Model
 * ==========
 */

var NavNode = new keystone.List('NavNode', {
  map: { name: 'title' },
  hidden: true, // admins don't see these
  autokey: { path: 'slug', from: 'title', unique: true }
});

var navOrderMax = 50;

function navOrderOptions() {
  var options = '';
  for(var i = 1; i <= navOrderMax; i++) {
    options += i < navOrderMax ? i+',' : i;
  }
  return options;
}

NavNode.add({
  title: { type: String, required: true },
  slug: { type: String, noedit: true },
  routePath: { type: String, noedit: true, hidden: true },
  level: { type: Number, noedit: true, hidden: true },
	bannerImage: { type: Types.CloudinaryImage, autoCleanup: true, folder: 'banners',
                 note: 'The image uploaded will be used as the main banner image in the template header of this page/section' },
  navOrder: { type: Types.Select, options: navOrderOptions(),
              default: navOrderMax,
              note: 'This is used when the menu is created: it overrides the alphabetical ordering of items that appear at the same menu level (lower numbers appear first).' }
});
addCloudinaryCleanupBehaviours(NavNode);

NavNode.register();

exports = module.exports = NavNode;  
