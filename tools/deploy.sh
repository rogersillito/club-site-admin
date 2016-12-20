#!/bin/bash

echo "Removing deploy directory..."
rm -rf ./deploy

echo "Linking files to deploy directory..."
cp -lrf . ../club-site-admin-deploy
mv ../club-site-admin-deploy ./deploy

cd ./deploy

echo "Removing files/directories to exclude from deployment..."
rm -rf spec
rm -rf grunt
rm -rf bower_components
rm -rf tools
rm -rf .git

rm bower.json
rm .bowerrc
rm .editorconfig
rm .jsbeautifyrc
rm .jshintrc
rm .nvmrc
rm .travis.yml
rm Gruntfile.js

echo "Adding openshift remote..."
pwd
git remote -v
git remote add openshift ssh://58518e8b0c1e66829100007a@site-lowfellrc.rhcloud.com/~/git/site.git/
pwd

echo "Force add all production dependencies to git:"
for dep in $(npm ls --depth=0 --prod --parseable | sed '1d' | awk '{gsub(/\/.*\//,"",$1); print}'| sort -u)
do
    echo "adding $dep dependency..."
    git add -f node_modules/$dep
done

echo "Deploying to openshift (git push)..."
# git push -f openshift master

echo "Cleaning deploy dir..."
git reset --hard HEAD
git clean -df
