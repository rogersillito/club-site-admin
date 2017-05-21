dir=$(pwd)
echo -e "Removing files/directories to exclude from deployment..."
rm -rf spec
rm -rf grunt
rm -rf bower_components
rm -rf tools

rm bower.json
rm .bowerrc
rm .editorconfig
rm .deployconfig
rm .jsbeautifyrc
rm .jshintrc
rm .nvmrc
rm .travis.yml
rm Gruntfile.js
rm Procfile
echo -e "Done.\n"
