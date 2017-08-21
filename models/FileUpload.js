var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');

var FileUpload = new keystone.List('FileUpload', {
	autokey: { from: 'name', path: 'fileId', unique: true }
});

FileUpload.add({
	name: {
		type: String,
		required: true
	},
	uploadDate: {
		type: Types.Datetime,
		readonly: true
	},
	publishedDate: { type: Types.Datetime, hidden: true, index: true },
	file: {
		type: Types.S3File,
		label: 'File',
		note: 'Select the file to upload (using Amazon S3 Storage).',
		allowedTypes: [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
			'image/gif',
			'image/png',
			'image/jpeg',
			'image/bmp',
			'image/webp',
			'text/plain',
			'text/html',
			'audio/mpeg',
			'audio/wav',
			'audio/wave'
		]
	}
});

FileUpload.schema.pre('save', function(next) {
  this.uploadDate = Date.now();
	return next();
});

// FileUpload.schema.statics.doSomething = function(a,b,c) {
// };


FileUpload.defaultColumns = 'name, publishedState, publishedDate';
FileUpload.register();
