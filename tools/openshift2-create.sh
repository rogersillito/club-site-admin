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

#TODO: remove default repo contents: cd $app, rm -rf etc..
#      then remove $app dir the above commands creates!
