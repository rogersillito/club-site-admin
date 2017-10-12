# club-site-admin

This system drives the *[Low Fell Running Club](https://www.lowfellrunningclub.co.uk)* website.  It is built using the [Keystone.js](http://keystonejs.com/) CMS/application platform for [node.js](https://nodejs.org/).

[![Build Status](https://travis-ci.org/rogersillito/club-site-admin.svg?branch=master)](https://travis-ci.org/rogersillito/club-site-admin)

## Development

### Prerequisites

* Nodejs 4.4.8
* npm 5.3.0
* mongodb 2.4+

### Build tools

There are various grunt tasks available to aid development:

`grunt --help`

In addition the test suite can be run via `npm test`

### Building client javascript

This is done via webpack, set to run as an npm script:

```
npm run webpack
npm run webpack-prod
```

The production bundles are version controlled - _and must be regenerated manually_.

### Building CSS

* The site is based on the sass build of [Bootstrap](https://getbootstrap.com/docs/3.3/), with theming based upon [Bootswatch](https://bootswatch.com/).
* To regenerate styles: `grunt css` 
* (Alternatively `grunt watch` will trigger regeneration on source changes)

## Configuration
### Email

* emails sent from the system use the Mailgun service: https://www.mailgun.com/
* email addresses to receive system-generated messages are configured in _Site Config_.
* The _.env_ file (root dir) must contain settings necessary to connect with mailgun, e.g.

```
MAILGUN_DOMAIN=sandboxd123abc123abc123abc123abc123abc1.mailgun.org
MAILGUN_DOMAIN=nameofmailgundomain.mailgun.org
```

### Image hosting

* uploaded images are hosted using the Cloudinary service: http://cloudinary.com/
* The _.env_ file (root dir) must contain settings necessary to connect with cloudinary, e.g.

```
CLOUDINARY_URL=cloudinary://123412341234123:-ABCABCABCABCABCABCABCABCAB@account
```

### File hosting

* uploaded fiels are hosted using Amazon S3 storage: https://aws.amazon.com/s3/
* A bucket, and access key pair must be pre-configured for the site to use
* The _.env_ file (root dir) must contain bucket/access key settings required to connect with S3, e.g.

```
S3_KEY=ABCABCABCABCABCABCAB
S3_SECRET=123412341234123123412341234123abc/+12341
S3_BUCKET=nameofpreconfiguredbucket
S3_REGION=eu-west-1
```

## License

This software is available under the MIT license.
