/**
 * create top-level menu links to system managed pages
 */

var keystone = require('keystone'),
	  async = require('async'),
	  HomePage = keystone.list('HomePage'),
    MenuLink = keystone.list('MenuLink');

var menuLinks = [
  { 'title': 'News', 'relativeUrl': '/posts', 'navOrder': 1 },
  { 'title': 'Results', 'relativeUrl': '/results', 'navOrder': 2 },
  { 'title': 'Gallery', 'relativeUrl': '/gallery', 'navOrder': 3 },
  { 'title': 'Contact Us', 'relativeUrl': '/contact', 'navOrder': 4 }
];

var homeId;
function createLink(menuLink, done) {
	
	var newMenuLink = new MenuLink.model();
	
	newMenuLink.isPublished = true;
	newMenuLink.parent = homeId;
	newMenuLink.title = menuLink.title;
	newMenuLink.relativeUrl = menuLink.relativeUrl;
	newMenuLink.navOrder = menuLink.navOrder;

  console.log("newMenuLink = ", newMenuLink);
	newMenuLink.save(function(err) {
		if (err) {
			console.error("Error adding menu link " + menuLink.title + " to the database:");
			console.error(err);
		} else {
			console.log("Added menu link " + menuLink.title + " to the database.");
		}
		done(err);
	});
}

exports = module.exports = function(done) {
  async.waterfall([
    function(callback) {
      var homeNode = HomePage.model.findOne({level: 0, __t: 'HomePage'}, '_id', function(err, home) {
        if (err) {
          callback(err);
        }
        callback(null, home._id);
      });
    }
  ], function (err, homePageId) {
    if (err) {
      done(err);
      return;
    }
    homeId = homePageId;
	  async.forEach(menuLinks, createLink, done);
  });
};
