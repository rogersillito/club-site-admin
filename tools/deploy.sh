#!/bin/bash

deploy_dir=../club-site-admin-deploy
done="Done.\n"
origin_url="$(git config --get remote.origin.url)"

echo "Preparing Deployment Repository"
echo "-------------------------------"

if [ -d "$deploy_dir" ]; then
    rm -rf $deploy_dir
    echo -e "Removed existing deploy directory.\n"
fi

# echo "Linking files to deploy directory..."
# cp -lrf . $deploy_dir
# cd $deploy_dir
# echo -e $done

cd $deploy_dir

echo "Creating deploy repo & adding remotes..."
git init
git remote add openshift ssh://58518e8b0c1e66829100007a@site-lowfellrc.rhcloud.com/~/git/site.git/
git remote add origin $origin_url
git remote -v
echo -e $done

# TODO: SEPARATE SCRIPT!
echo "Merging in changes from origin/deploy..."
git fetch origin deploy
git merge origin/deploy -X ours
echo -e $done

echo "Merging in changes from origin/master..."
git fetch origin master
commit_id=$(git log FETCH_HEAD -n 1 --pretty=format:"%H")
commit_date=$(git log FETCH_HEAD -n 1 --pretty=format:"%aD")
commit_msg=$(git log FETCH_HEAD -n 1 --pretty=format:"%B")
git merge origin/master -X theirs
echo "Synchronising changes to node_modules..."
rm -rf ./node_modules
cp -lrf "$working_copy/node_modules" ./node_modules 
./tools/remove-non-deploy-files.sh
git add -A
echo -e $done

echo "Force add all production dependencies..."
for dep in $(npm ls --depth=0 --prod --parseable | sed '1d' | awk '{gsub(/\/.*\//,"",$1); print}'| sort -u)
do
    git add -f node_modules/$dep
    echo "added $dep dependency."
done

git add -f .env
echo "added .env file."

echo -e $done
# END:SEPARATE SCRIPT!

echo "---------------------------------------------------------"
git status
echo -e "---------------------------------------------------------\n"

echo "Latest commit to deploy:"
echo $commit_id
echo $commit_date
echo $commit_msg

echo -e "type 'deploy' to continue:"
read input_variable
if ! [ "$input_variable" = "deploy" ]; then
    echo "aborting deploy!"
    exit 0
fi

echo "Committing deployment..."
git add .
git commit -m "System Deployment: latest commit - id = $commit_id, date = $commit_date"
echo -e $done

echo "Beginning Deployment"
echo "--------------------"

git push -f openshift master
echo -e $done
