var keystone = require('keystone');
var _ = require('underscore');
var modelHelpers = require('../../lib/modelHelpers');
var resultHelpers = require('../../lib/meetingResultHelpers');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);

	view.on('init', function(next) {
    var view = new keystone.View(req, res);
    var locals = res.locals;
	  locals.bannerTitle = `<span class="home-banner">Welcome to<br /> <span><img src="/images/logo-home-banner.png" alt="${locals.siteName}"></span> <small class="tagline">Founded 1985</small></span>`;
    locals.pageTitle = 'Home';
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
  var numUpdates = 8;
  // get latest post updates
	view.on('init', function(next) {
	  keystone.list('Post').model
      .getLatestPublished(numUpdates, 'title slug categories content.summary publishedDate publishedDateString image1 image2 image3 bannerImage', 'categories')
      .then(posts => {
        const mapped = posts.map(p => {
          const category = _.first(p.categories);
          return {
            type: category.name,
            link: `/post/${category.key}/${p.slug}`,
            iconClass: category.icon,
            img: getImageSrc(p),
            title: p.title,
            summaryHtml: p.content.summary,
            sort: p._.publishedDate.moment().unix(),
            date: p.publishedDateString
          };
        });
        updates = updates.concat(mapped);
        return next();
      })
      .catch(err => next(err));
  });

  // get latest gallery updates
	view.on('init', function(next) {
	  keystone.list('Gallery').model
      .getLatestPublished(numUpdates, 'name description publishedDate publishedDateString images bannerImage')
      .then(galleries => {
        var imgSrc = undefined;
        const mapped = galleries.map(p => {
          if (p.bannerImage.url) {
            imgSrc = modelHelpers.getCloudinarySrc(p._.bannerImage.src, namedTransform);
          }
          else if (p.images.length) {
            // just use the first gallery image
            const firstIm = _.first(p.images);
            imgSrc = modelHelpers.getCloudinarySrc(firstIm.src.bind(firstIm), namedTransform);
          }
          return {
            type: 'Gallery',
            link: '#', //TODO!
            iconClass: 'icon-images',
            img: imgSrc,
            title: p.name,
            summaryHtml: p.description,
            sort: p._.publishedDate.moment().unix(),
            date: p.publishedDateString
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
            date: p.publishedDateString
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
    resultHelpers.getLatestResults(model, numUpdates).then(latestResults => {
      res.locals.latestResults = latestResults;
      console.log("latestResults = ", latestResults);
      next();
    })
    .catch(err => next(err));
  });

  

	// Render the view
	view.render('index');
	
};
