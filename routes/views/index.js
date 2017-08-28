var keystone = require('keystone');
var _ = require('underscore');
var modelHelpers = require('../../lib/modelHelpers');
var resultHelpers = require('../../lib/meetingResultHelpers');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	
  var numUpdates;
  var numResults;
	view.on('init', function(next) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
	  locals.bannerTitle = `<span class="home-banner">Welcome to<br /> <span><img src="/images/logo-home-banner.png" alt="${locals.siteName}"></span> <small class="tagline">Founded 1985</small></span>`;
		locals.titleClass = 'home-page';
    locals.pageTitle = 'Home';
		numResults = locals.page.ResultsToShow;
		numUpdates = locals.page.UpdatesToShow;
    next();
  });

  const namedTransform = 'media_lib_thumb';
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
        src = modelHelpers.getCloudinarySrc(item._[f].src, namedTransform);
      }
    });
    return src;
  };

  var updates = [];
  // get latest post updates
	view.on('init', function(next) {
	  keystone.list('Post').model
      .getLatestPublished(numUpdates, 'title slug categories content.summary publishedDate publishedDateString image1 image2 image3 bannerImage', 'categories')
      .then(posts => {
        const mapped = posts.map(p => {
          const category = _.first(p.categories) || { name: '', key: '' };
          return {
            type: category.name,
            link: `/post/${category.key}/${p.slug}`,
            iconClass: category.icon,
            img: getImageSrc(p),
            title: p.title,
            summaryHtml: p.content.summary,
            sort: p._.publishedDate.moment().unix(),
            updateDate: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        return next();
      })
      .catch(err => {
				console.log(err);
				next(err);
			});
  });

  // get latest gallery updates
	view.on('init', function(next) {
	  keystone.list('Gallery').model
      .getLatestPublished(numUpdates, 'key name description publishedDate publishedDateString thumbnailSrc')
      .then(galleries => {
        const mapped = galleries.map(p => {
          return {
            type: 'Gallery',
            link: '/gallery/' + p.key,
            iconClass: 'icon-images',
            img: p.thumbnailSrc,
            title: p.name,
            summaryHtml: p.description,
            sort: p._.publishedDate.moment().unix(),
            updateDate: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        return next();
      })
      .catch(err => next(err));
  });

	view.on('init', function(next) {
	  keystone.list('Page').model
      .getLatestPublished(numUpdates, 'title routePath summary publishedDate publishedDateString image1 image2 image3 bannerImage')
      .then(pages => {
        const mapped = pages.map(p => {
          return {
            type: 'Page',
            link: '/pages' + p.routePath,
            iconClass: 'icon-file-text2',
            img: getImageSrc(p),
            title: p.title,
            summaryHtml: p.summary,
            sort: p._.publishedDate.moment().unix(),
            updateDate: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        return next();
      })
      .catch(err => next(err));
  });

	view.on('init', function(next) {
    const aggregatedUpdates = _.sortBy(updates, (item) => {
      return item.sort;
    }).reverse().slice(0,numUpdates);
    // console.log("updates = ", aggregatedUpdates);
    res.locals.whatsnew = aggregatedUpdates;
    next();
  });

	view.on('init', function(next) {
    var model = keystone.list('MeetingResult').model;
    resultHelpers.getLatestResults(model, numResults).then(latestResults => {
      res.locals.latestResults = latestResults;
      // console.log("latestResults = ", latestResults);
      next();
    })
    .catch(err => next(err));
  });

	// Render the view
	view.render('index');
	
};
