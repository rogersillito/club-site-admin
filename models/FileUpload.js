var keystone = require('keystone');
var Types = keystone.Field.Types;
var _ = require('underscore');
var path = require('path');
var AWS = require('aws-sdk');
var moment = require('moment');
var dateHelpers = require('../lib/dateHelpers');

var FileUpload = new keystone.List('FileUpload', {
	autokey: { from: 'name', path: 'fileId', unique: true },
	defaultSort: '-uploaded'
});

const timestampFormat = dateHelpers.formatStrings.fileTimestamp;
FileUpload.add({
	name: {
		type: String,
		// noedit: true,  // allows filename/doc name to get out of sync - but probably useful to be able to edit public name
		required: true
	},
	uploadDate: {
		type: String,
		default: '',
		noedit: true
	},
	uploaded: {
		// only used for sorting the list - give same name as visible date string
		label: 'Uploaded Date', 
		type: Types.Datetime,
		hidden: true
	},
	originalName: {
		label: 'Uploaded Filename',
		type: String,
		noedit: true,
		watch: true,
		value: function() {
			return (this.file && this.file.originalname) || '';
		}
	},
	version: {
		type: Types.Number,
		noedit: true,
		default: 0
	},
	requireFile: {
		type: Types.Boolean,
		hidden: true,
		default: false
	},
  downloadUrl: {
    type: Types.Url,
    noedit: true,
    watch: true,
    value: function() {
			return this.file && this.file.url
			  ? 'https:' + this.file.url
			  : '';
		},
    format: url => url
  },
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
		],
		filename: (doc, filename) => {
			var ext = path.extname(filename);
			// var ts = doc._.uploadDate.format('YYYY-MM-DD_hh-mm-ss_');
			var ts = moment().format(timestampFormat + '_');
			var name = ts + doc.fileId + ext;
			return name;
		}
	}
});

// helper methods for interacting directly with S3:
const s3Options = {
	accessKeyId: process.env.S3_KEY,
	secretAccessKey: process.env.S3_SECRET,
	region: process.env.S3_REGION
};
AWS.config.update(s3Options);
var s3Client = new AWS.S3();

const deleteS3File = filename => {
	const deleteParams = {
		Bucket: process.env.S3_BUCKET,
		Delete: {
			Objects: [{ Key: filename }]
		}
	};
	s3Client.deleteObjects(deleteParams, (err, data) => {
		if (err) {
			console.error(err, err.stack);
			return;
		}
		const msg = _.find(data.Deleted, obj => obj.Key === filename) ? "Cleaned up" : "Failed to delete";
		console.log(msg + ' S3 file: ' + filename);
	});
};



// MIDDLEWARE
var initialS3Filename = undefined;
FileUpload.schema.post('init', function(doc) {
	if (doc.file) {
		initialS3Filename = doc.file.filename;
	}
});

FileUpload.schema.pre('save', function(next) {
	if (this.requireFile) {
		if (this.file && (typeof(this.file.url) === 'undefined' || this.file.url === '')) {
			// prevent removal of contained S3 file, or save without file (except for initial creation of doc)
			next(new Error('FILE IS REQUIRED: If you wish to remove this upload, please remove the File Upload entry itself (by clicking "delete file upload") rather than the file you have attached to it.'));
		}
	}	else {
		this.requireFile = true; // next save requires a file!
	}

  this.uploadDate = '';
	if (this.file) {
		if (this.file.filename) {
			// set uploadDate based on filename timestamp
			const filnameTs = this.file.filename.substr(0,timestampFormat.length);
			const filetime = this._.uploaded.parse(filnameTs, timestampFormat);
			const formatted = filetime.format(dateHelpers.formatStrings.dayDateTimeString);
			this.uploadDate = formatted;

			if (initialS3Filename !== this.file.filename) {
				// file changed - update version
				this.version = this.version + 1;
			}
		}
	}

	return next();
});

FileUpload.schema.post('save', function(doc) {
	if (initialS3Filename && doc.file && initialS3Filename !== doc.file.filename) {
		// new file uploaded: cleanup previously uploaded version in S3
		deleteS3File(initialS3Filename);
	}
});

FileUpload.schema.post('remove', function(doc) {
	if (doc.file && doc.file.filename) {
		// file deleted: cleanup file in S3
		deleteS3File(doc.file.filename);
	}
});

FileUpload.defaultColumns = 'name, originalName, uploadDate, version';
FileUpload.register();
