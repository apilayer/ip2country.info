#!/bin/bash

prg="wget"
download_path="/tmp"
geolite_path="/usr/share/GeoIP"

#set -e
[ -d $download_path ] || mkdir $download_path
if [ ! -e $geolite_path ]; then
    echo "Unable to find GeoIP directory: $geolite_path"
    exit 1
fi

cd $download_path

$prg http://geolite.maxmind.com/download/geoip/database/GeoIPv6.dat.gz
if [ ! -e $download_path/GeoIPv6.dat.gz ]; then
    echo "Unable to find GeoIPv6.dat.gz!"
    exit 1
fi
gunzip -c $download_path/GeoIPv6.dat.gz > $geolite_path/GeoIPv6.dat
rm -f $download_path/GeoIPv6.dat.gz

service nginx reload
