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

  var updates = [];
  var numUpdates = 8;
  // get latest post updates
	view.on('init', function(next) {
	  keystone.list('Post').model
      .getLatestPublished(numUpdates, 'title content.summary publishedDateString image1 image2 image3 bannerImage')
      .then(posts => {
        const mapped = posts.map(p => {
          return {
            type: undefined, //TODO: set 1 category!
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

  // get latest gallery updates
	view.on('init', function(next) {
	  keystone.list('Gallery').model
      .getLatestPublished(numUpdates, 'name description publishedDateString images bannerImage')
      .then(galleries => {
        const mapped = galleries.map(p => {
          return {
            type: 'gallery',
            img: undefined,//getImageSrc(p), //TODO! multiples...
            title: p.name,
            summaryHtml: p.description,
            date: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        console.log("updates = ", updates);
        return next();
      })
      .catch(err => next(err));
  });

	view.on('init', function(next) {
	  keystone.list('Page').model
      .getLatestPublished(numUpdates, 'title summary publishedDateString image1 image2 image3 bannerImage')
      .then(pages => {
        const mapped = pages.map(p => {
          return {
            type: 'page',
            img: getImageSrc(p),
            title: p.title,
            summaryHtml: p.summary,
            date: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        console.log("updates = ", updates);
        return next();
      })
      .catch(err => next(err));
  });

	view.on('init', function(next) {
    //TODO: get aggregated latest
    console.log("updates = ", updates);
    next();
  });

	// Render the view
	view.render('index');
	
};
