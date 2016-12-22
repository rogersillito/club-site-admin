#!/bin/bash

deploy_dir=../club-site-admin-deploy
done="Done.\n"
origin_url="$(git config --get remote.origin.url)"

echo "Beginning Deploy"
echo "----------------"

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

echo "Creating deploy repo & adding remotes..."
git init
git remote add openshift ssh://58518e8b0c1e66829100007a@site-lowfellrc.rhcloud.com/~/git/site.git/
#git remote add openshift git@github.com:rogersillito/testy.git 
git remote add origin $origin_url
git remote -v
echo -e $done

echo "Merging in openshift deploy files:"
git fetch origin deploy
git merge origin/deploy

echo "Adding files to git:"
echo "Force add all production dependencies..."
for dep in $(npm ls --depth=0 --prod --parseable | sed '1d' | awk '{gsub(/\/.*\//,"",$1); print}'| sort -u)
do
    git add -f node_modules/$dep
    echo "added $dep dependency."
done

git add -f .env
echo "added .env file."

echo "Adding remaining files and committing..."
git add .
git commit -m "System Deployment"
echo -e $done

echo "Deploying to openshift ..."
git push -f openshift master
echo -e $done
