# club-site-admin

## Development

* Nodejs 4.2.3
* npm 5.0.3

### Building client javascript

This is done via webpack, set to run as an npm script:

```
npm run webpack
npm run webpack-prod
```

The production bundles are version controlled.

## Deployment

* need to install ruby rhc tools to manage openshift application
* run `./tools/deploy.sh` (must be executable if just cloned!)
  * this merges in the remote _deploy-openshift_ branch into currently deployed site code (in openshift git repo), with the remote _master_ branch
  * must push up changes to github first before running
  * requires file _.deployconfig_ to contain the url (ssh://...) of the openshift git deployment repo
* run `./tools/openshift2-create.sh` to destroy/recreate the remote deployment site in openshift (must be executable..)
* Openshift versions of npm and node are specified in the _deploy-openshift_ branch

## Email 

* emails sent from the system use the Mailgun service: https://www.mailgun.com/
* email addresses to receive system-generated messages are configured in _Site Config_.
* The _.env_ file (root dir) must contain settings necessary to connect with mailgun, e.g.

```
MAILGUN_DOMAIN=sandboxd4616b01db4c4c3183aff4840fed2e4f.mailgun.org
MAILGUN_DOMAIN=nameofmailgundomain.mailgun.org
```

## Image hosting 

* uploaded images are hosted using the Cloudinary service: http://cloudinary.com/
* The _.env_ file (root dir) must contain settings necessary to connect with cloudinary, e.g.

```
CLOUDINARY_URL=cloudinary://123412341234123:-ABCABCABCABCABCABCABCABCAB@account
```
