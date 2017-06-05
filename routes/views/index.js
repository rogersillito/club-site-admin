var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	view.on('init', function(next) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
	  locals.bannerTitle = `<span class="home-banner">Welcome to<br /> <span><img src="/images/logo-home-banner.png" alt="${locals.siteName}"></span> <small class="tagline">Founded 1985</small></span>`;
    locals.pageTitle = 'Home';
    next();
  });

	view.on('init', function(next) {
    // get latest updates
    var numUpdates = 10;
	  keystone.list('Post').model
      .getLatestPublished(numUpdates)
      .then(posts => {
        //TODO: do something with them..
        console.log("posts = ", posts);
        return next();
      })
      .catch(err => next(err));
  });

	// Render the view
	view.render('index');
	
};
