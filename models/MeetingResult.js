var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MeetingResult Model
 * =============
 */

var MeetingResult = new keystone.List('MeetingResult', {
	autokey: { from: 'nameOrLocation', path: 'key', unique: true }
});

MeetingResult.add({
	  nameOrLocation: { type: String, required: true, initial: true },
	  date: { type: Date, default: Date.now, required: true }
});

MeetingResult.register();
