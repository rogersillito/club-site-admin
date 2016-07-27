var keystone = require('keystone');
var Page = keystone.list('Page');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	
  var q = Page.model.findOne({
    slug: req.params.slug
  });
  q.exec(function(err, result){
    if (!result) {
      return res.status(404).send('Page Not Found!');
    }
    locals.page = result;
    console.log(result.constructor.view_name);

	  view.render('page');
  });
};
