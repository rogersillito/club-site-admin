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

  const getImageSrc = item => {
    const fields = [
      'bannerImage',
      'image1',
      'image2',
      'image3'
    ];
    var src;
    fields.forEach(f => {
      if (!src && item[f].url) {
        src = item._[f].src({transformation: ["media_lib_thumb"]}).replace('f_auto',''); // keystone adds auto format - which isn't specified in named transform (-> breaks 'strict')
      }
    });
    return src;
  };

	view.on('init', function(next) {
    // get latest updates
    var updates = [];
    var numUpdates = 10;
	  keystone.list('Post').model
      .getLatestPublished(numUpdates, 'title content.summary content.monkey publishedDateString image1 image2 image3 bannerImage')
      .then(posts => {
        const mapped = posts.map(p => {
          return {
            img: getImageSrc(p),
            title: p.title,
            summaryHtml: p.content.summary,
            date: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        console.log("updates = ", updates);
        return next();
      })
      .catch(err => next(err));
  });

  //TODO: galleries, pages then get aggregated latest

	// Render the view
	view.render('index');
	
};
