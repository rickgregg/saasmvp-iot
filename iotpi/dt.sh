#!/bin/sh
dt=$(date +%s)
msg="{'iot':'${dt}'}"
echo $dt
echo $msg
