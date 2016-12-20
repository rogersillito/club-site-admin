#!/bin/bash

rm -rf ./deploy

cp -lrf . ../club-site-admin-deploy
mv ../club-site-admin-deploy ./deploy

cd ./deploy
rm -rf spec
rm -rf grunt
rm -rf bower_components
rm -rf tools
rm -rf .git

rm bower.json
rm .bowerrc
rm .editorconfig
# rm .env
rm .jsbeautifyrc
rm .jshintrc
rm .nvmrc
rm .travis.yml
rm Gruntfile.js

git init
git add -f node_modules/async
git add -f node_modules/cloudinary
git add -f node_modules/dotenv
git add -f node_modules/es6-promise
git add -f node_modules/express-handlebars
git add -f node_modules/handlebars
git add -f node_modules/keystone
git add -f node_modules/moment
git add -f node_modules/underscore
git status

git remote add openshift ssh://58518e8b0c1e66829100007a@site-lowfellrc.rhcloud.com/~/git/site.git/
