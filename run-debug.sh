#!/bin/bash
. ~/.nvm/nvm.sh

echo "Running club-site-admin (with node-debug)"

nvm use 0.10.40

if [ "$1" == "-b" ];
then
   echo -e "\033[1;32mRun debugger in Chrome to continue...\033[0m"
   node-debug keystone.js
else
   echo -e "\033[1;34m(Run with -b to set breakpoints before running)\033[0m"
   node-debug --no-debug-brk keystone.js
fi
