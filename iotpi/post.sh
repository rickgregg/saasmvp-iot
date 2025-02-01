#!/bin/sh
#endpoint server post test
epoch=$(date +%s)
msg="{\"iot\":\"${epoch}\"}"
echo $msg


curl --location 'http://192.168.1.13/iot/data' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data '{"iot": "1738364523"}'
#--data "$msg"

