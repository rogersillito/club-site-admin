# club-site-admin

## Development

* Nodejs 4.2.3
* npm 5.0.3

## Deployment

* need to install ruby rhc tools to manage openshift application
* run `./tools/deploy.sh` (must be executable if just cloned!)
  * this merges in the remote _deploy-openshift_ branch into currently deployed site code (in openshift git repo), with the remote _master_ branch
  * must push up changes to github first before running
  * requires file _.deployconfig_ to contain the url (ssh://...) of the openshift git deployment repo
* run `./tools/openshift2-create.sh` to destroy/recreate the remote deployment site in openshift (must be executable..)
* Openshift versions of npm and node are specified in the _deploy-openshift_ branch
