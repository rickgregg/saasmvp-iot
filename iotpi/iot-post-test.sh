#!/bin/sh
#endpoint server iot post test
epoch=$(date +%s)
curl --location 'http://192.168.1.13/iot/data' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data '{"iot": '\"$epoch\"'}'
echo ""

