#!/bin/bash

deploy_dir=../club-site-admin-deploy
done="Done.\n"

echo "Beginning Deploy"
echo -e "----------------\n"

if [ -d "$deploy_dir" ]; then
    rm -rf $deploy_dir
    echo -e "Removed existing deploy directory.\n"
fi

echo "Linking files to deploy directory..."
cp -lrf . $deploy_dir
cd $deploy_dir
echo -e $done

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
echo -e "Removed files/directories to exclude from deployment.\n"

echo "Creating deploy repo & adding openshift remote..."
git init
git remote add openshift ssh://58518e8b0c1e66829100007a@site-lowfellrc.rhcloud.com/~/git/site.git/
git remote -v
echo -e $done

echo "Adding files to git:"
echo "Force add all production dependencies..."
for dep in $(npm ls --depth=0 --prod --parseable | sed '1d' | awk '{gsub(/\/.*\//,"",$1); print}'| sort -u)
do
    git add -f node_modules/$dep
    echo "added $dep dependency."
done

echo "Adding remaining files..."
git add .
echo -e $done

echo "Deploying to openshift ..."
git push -f openshift master
echo -e $done
