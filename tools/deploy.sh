#!/bin/bash

deploy_dir=../club-site-admin-deploy
done="Done.\n"
origin_url="$(git config --get remote.origin.url)"
working_copy=$(pwd)
show_time() {
    t=$(date +"%r")
    echo "@ $t"
}
show_status() {
    echo "---------------------------------------------------------"
    git status
    echo -e "---------------------------------------------------------\n"
}

echo "Preparing Deployment Repository"
echo "-------------------------------"
echo $(show_time)

# read deploy repo url from config file
# e.g: echo ssh://1234123412341234@accountname.rhcloud.com/~/git/site.git/ > .deployconfig
configfile=".deployconfig"
while IFS= read -r url
do
    deploy_repo=$url
done < "$configfile"

if [ "$deploy_repo" = "" ]; then
   echo -e "Cannot get deploy repo url from '$configfile' file.\n"
   exit 1
fi

echo "Using deploy url = $deploy_repo "

if [ -d "$deploy_dir" ]; then
    rm -rf $deploy_dir
    echo -e "Removed existing deploy directory.\n"
fi
mkdir $deploy_dir


echo "Copying .env file..."
cp .env $deploy_dir -v

echo "Initialising deploy repo & adding remotes..."
cd $deploy_dir
git init
git remote add openshift $deploy_repo
git remote add origin $origin_url
git remote -v
echo -e $done

echo "Loading latest deployment version..."
git fetch openshift --verbose
git reset --hard openshift/master
echo -e $done

echo "Merging in changes from origin/deploy-openshift..."
git fetch origin deploy-openshift
git merge origin/deploy-openshift -X theirs --no-commit

if [[ `git status --porcelain` ]]; then
    show_status
    echo -e "Press any key to commit changes..."
    read
    git commit -m "merging in deploy-openshift branch"
fi
echo -e $done
# exit 0

echo "Merging in changes from origin/master..."
git fetch origin master
commit_id=$(git log FETCH_HEAD -n 1 --pretty=format:"%H")
commit_date=$(git log FETCH_HEAD -n 1 --pretty=format:"%aD")
commit_msg=$(git log FETCH_HEAD -n 1 --pretty=format:"%B")
git merge origin/master -X theirs --no-commit
echo "Removing existing node_modules..."
git rm -r node_modules
rm -rf ./node_modules
echo "Synchronising changes to node_modules..."
cp -lrf "$working_copy/node_modules" ./node_modules 
. $working_copy/tools/remove-non-deploy-files.sh
echo "Add changes to staging..."
git add -A
echo -e $done

echo "Force add all production dependencies..."
for dep in $(npm ls --prod --parseable | sed '1d' | sort -u)
do
    git add -f $dep
    echo "added $dep dependency."
done

git add -f .env
echo "added .env file."

echo -e $done
echo $(show_time)

show_status

echo "Latest commit to deploy:"
echo $commit_id
echo $commit_date
echo $commit_msg

echo -e "type 'deploy' to continue:"
read deploy_confirm
if ! [ "$deploy_confirm" = "deploy" ]; then
  echo "aborting deploy!"
  exit 0
fi


hotdeploy=.openshift/markers/hot_deploy
touch $hotdeploy
echo -e "\nPerform hot deploy? ('no' for full deploy)"
echo "https://developers.openshift.com/managing-your-applications/modifying-applications.html#hot-deployment"
read dohotdeploy
if [ "$dohotdeploy" = "no" ]; then
    rm $hotdeploy
    git rm $hotdeploy
    echo -e "\n-- Performing FULL deploy"
else
    echo -e "\n** Performing HOT deploy"
fi

echo -e "\nCommitting deployment..."
git add -A
git commit -m "System Deployment: latest commit - id = $commit_id, date = $commit_date, message = $commit_msg"
echo -e $done

echo "Beginning Deployment"
echo "--------------------"
echo $(show_time)

git push openshift master
# git push -f openshift master
if ! [ "$dohotdeploy" = "no" ]; then
    rhc app-restart site
fi
echo -e $done
echo $(show_time)
