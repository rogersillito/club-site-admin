var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var modelHelpers = require('../lib/modelHelpers');

/**
 * SiteConfig Model
 * ==========
 */

var adminName = 'Settings';
var SiteConfig = new keystone.List('SiteConfig', {
  nocreate: true,
  nodelete: true,
  sortable: false,
  singular: adminName,
  plural: adminName
});

var wysiwygOptions = modelHelpers.wysiwygMainContentSettings();

const enqRecipientNote = 'All enquiries received will be emailed to this address, if provided.  NB: must be a verified, authorized recipient in Mailgun account: https://app.mailgun.com/app/account/authorized';
const enqRecipient = 'All enquiries received will be emailed to this address, if provided.';
SiteConfig.add(
	{ name: { type: Types.Text, required: true, index: true, note: 'The name of the site goes in the box above.' } },
	{ heading: 'Enquiries' },
	{ enquiryRecipient1: { type: Types.Email, note: enqRecipientNote } },
	{ enquiryRecipient2: { type: Types.Email, note: enqRecipientNote } },
	{ enquiryRecipient3: { type: Types.Email, note: enqRecipientNote } },
  { content: {
		type: Types.Html, wysiwyg: wysiwygOptions,
	  note: 'This content is displayed above the form used to send a new enquiry.'
	} }
);

SiteConfig.schema.methods.syncSettings = function() {
  // update keystone's settings with SiteConfig values
  var enquiryRecipients = '';
	var emails = [this.enquiryRecipient1, this.enquiryRecipient2, this.enquiryRecipient3];
	emails = _.reduce(emails, (memo,em) => { if (em) { memo.push(em); } return memo; }, []);
	keystone.set('enquiryRecipients', emails.join(','));

	if (this.name) {
		keystone.set('brand', this.name);
		keystone.set('name', '[Admin] ' + this.name);
	}
  console.log('** Keystone settings updated from SiteConfig.');
};

SiteConfig.schema.post('save', function(config) {
	this.syncSettings();
});

SiteConfig.defaultColumns = 'name';
SiteConfig.register();
