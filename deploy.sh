#!/bin/bash
# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")
set -e

pushd $SCRIPTPATH

echo "running npm ci "
npm ci --only=prod

echo "deleting zip file if exists"
rm -f ./stock_reducer.zip

echo "creation archieve"
content=("node_modules" "index.js")

echo ${content[@]}

zip_archieve="stock_reducer.zip"
zip -rv $zip_archieve ${content[@]}

output_folder=$1
cp -v $zip_archieve $output_folder

popd