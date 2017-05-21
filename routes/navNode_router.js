var keystone = require('keystone');  
var views = keystone.importer(__dirname)('./views');

exports = module.exports = function(req, res) {  
  var matchUrlSegments = req.params[0];
  var routePath = "/" + (matchUrlSegments || '');
  // console.log("getting NavNode for routePath = ", routePath);
  
  var q = keystone.list('NavNode').model.findOne({
    routePath: routePath
  });
  q.exec(function(err, result){
    if (err) {
      return res.status(500).send(err);
    }
    if (!result) {
      return res.notFound();
    }
    if (typeof(result.isPublished) !== 'undefined' && !result.isPublished) {
      return res.notFound('The page you requested is not available.');
    }
    res.locals.page = result;
    if (result.bannerImage.url) {
	    res.locals.bannerImage = result.bannerImage.url;
    }

    if(result.constructor.view_name) {
      return views[result.constructor.view_name](req, res);
    } else {
      return views.page(req, res);
    }
  });
};
