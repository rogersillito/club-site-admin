var keystone = require('keystone');
var middleware = require('../middleware');
var Enquiry = keystone.list('Enquiry');
var mailHelpers = require('../../lib/mailHelpers');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'contact';
	// locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

  view.on('init', function(next) {
    middleware.setLocalsFromMatchingMenuLink(req, res, next);
  });

  view.on('init', function(next) {
		// get html content
		var q = keystone.list('SiteConfig').model.findOne();
		q.exec(function(err, siteConfig){
			if (err) {
				return next(err);
			}
			locals.contentHtml = siteConfig.content;
			next();
		});
	});
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function(next) {
		const siteName = keystone.get('brand');
		const recipients = keystone.get('enquiryRecipients');
		// console.log("siteName = ", siteName);
		// console.log("recipients = ", recipients);
		// console.log("locals.formData = ", locals.formData);
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, message',
			errorMessage: 'There was a problem submitting your enquiry:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
				if (recipients) {
					var f = locals.formData;
					mailHelpers.sendMail({
						to: recipients,
						from: f['name.full'] + ' <' + f['email'] + '>',
						subject: siteName + ' Web Enquiry',
						text: f.message + '\r\n\r\n------------\r\nThis message has been stored under "Enquiries" in site admin.'
					});
				}
			}
			next();
		});
		
	});
	
	view.render('contact');
	
};
