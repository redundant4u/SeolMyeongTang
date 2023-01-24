#!/bin/sh

if [ $# -ne 1 ]; then
	echo 'No argument'
	exit -1
fi

### Load Next Build From S3
aws s3 cp s3://seolmyeongtang-cicd/client/$1.tar.gz $1.tar.gz

rm -rf build/*

### Unzip Next Build
tar -zxf $1.tar.gz -C build --strip 1

### Cleanup
rm $1.tar.gz
