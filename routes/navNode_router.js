var keystone = require('keystone');  
var views = keystone.importer(__dirname)('./views');

exports = module.exports = function(req, res) {  
  var locals = res.locals;
  var routePath = "/" + req.params[0];
  
  var q = keystone.list('NavNode').model.findOne({
    routePath: routePath
  });
  q.exec(function(err, result){
    if (!result || (typeof(result.isPublished) !== 'undefined' && !result.isPublished)) {
      //TODO: proper error handling - common error page/template?
      return res.status(404).send('Page Not Found.');
    }
    locals.page = result;
    if(result.constructor.view_name) {
      return views[result.constructor.view_name](req, res);
    } else {
      return views.page(req, res);
    }
  });
};
