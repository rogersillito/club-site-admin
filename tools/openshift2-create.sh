#!/bin/bash

app=site
nodecart=nodejs-0.10

# delete existing
rhc app delete $app --confirm

# create app with mongodb and scaleable node cartridge
rhc app-create $app $nodecart -s
rhc cartridge-add mongodb-2.4 -a $app -g small

# add storage to node cart
rhc cartridge-storage $nodecart -a $app --add 3GB

# remove default repo contents and push
cd ./$app
git rm -r '*'
git commit -m 'remove default openshift repo contents'
git push -u origin master

# remove repo created by rhc
cd ..
rm -rf ./$app

