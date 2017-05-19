
#!/bin/bash

deploy_dir=../club-site-admin-deploy2
done="Done.\n"
origin_url="$(git config --get remote.origin.url)"
working_copy=$(pwd)

echo "Beginning Redeploy"
echo "------------------"

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

echo "Using deploy url = $deploy_repo"

if ! [ -d "$deploy_dir" ]; then
    mkdir $deploy_dir
    echo -e "Created deploy directory.\n"

    cd $deploy_dir
    git init
    git remote add openshift $deploy_repo
    echo "Initialised deploy repo & added remotes..."
fi

echo "Getting current deployment files..."
cd $deploy_dir
git fetch openshift --verbose
git reset --hard openshift/master
# git clean -f -d
# git clean -f -X
git merge refs/remotes/openshift/master

echo "Linking files to deploy directory..."
cd $working_copy
cp -lrf . $deploy_dir
cd $deploy_dir
echo -e $done

cd $working_copy
./tools/remove-non-deploy-files.sh

cd $deploy_dir
exit 1


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
