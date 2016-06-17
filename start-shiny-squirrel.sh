#!/bin/sh

if [ -z $SHINY_SQUIRREL_MONGO_URL ]; then
    echo "No SHINY_SQUIRREL_MONGO_URL found, exiting."
    exit 1
fi

python /opt/squirrel/shiny_squirrel.py --mongo $SHINY_SQUIRREL_MONGO_URL
