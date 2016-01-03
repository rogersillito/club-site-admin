var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MeetingResult Model
 * =============
 */

var MeetingResult = new keystone.List('MeetingResult', {
	  autokey: { from: 'nameOrLocation', path: 'key', unique: true },
    map: { name: 'nameOrLocation'}
});

MeetingResult.add({
	  nameOrLocation: { type: String, required: true, initial: true },
	  date: { type: Types.Date, default: Date.now(), required: true },
    Result: { type: Types.Html, wysiwyg: true }
});

MeetingResult.defaultColumns = 'nameOrLocation, date|20%';
MeetingResult.register();
