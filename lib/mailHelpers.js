var request = require('request');

exports = module.exports = {};

function mailgunUrl() {
	const base = 'api.mailgun.net/v3';
	const apiKey = process.env.MAILGUN_API_KEY;
	const domain = process.env.MAILGUN_DOMAIN;
	const user = 'api';
	const url = 'https://' + user + ':' + apiKey + '@' + base + "/" + domain + "/messages";
	// console.log("url = ", url);
	return url;
}

exports.sendMail = function(spec) {
	request.post({url:mailgunUrl(), formData:spec}, function (error, response, body) {
		if (error) {
			console.error('Http error communicating with Mailgun:', error);
		}
		if (response) {
			if (response.statusCode == 200) {
				console.log('Mailgun Response:', body);
			} else {
				console.error('Mailgun send failed:', body);
				console.error('Request status:', response && response.statusCode);
				console.error('Mail spec:', JSON.stringify(spec,null,2));
			}
		}
	});
};
