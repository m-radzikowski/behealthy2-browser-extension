#!/usr/bin/env bash

command -v inkscape >/dev/null 2>&1 || { echo >&2 "Script requires inkscape to work, but it was not found. Aborting."; exit 1; }

SIZES=(16 32 48 128)
for SIZE in ${SIZES[*]}; do
	inkscape icon.svg -z -e "icon$SIZE.png" -h ${SIZE} icon.svg
done
