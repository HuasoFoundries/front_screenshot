VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build



version:
	@echo $(VERSION)

install: 
	npm install
	$$(npm bin)/jspm install --quick

test:
	$$(npm bin)/karma start

	
build:
	$$(npm bin)/jspm build front_screenshot dist/ig_screenshot.es6.js --format esm --skip-source-maps 
	$$(npm bin)/jspm build front_screenshot dist/ig_screenshot.min.js -m --global-name screenShooter  --format umd
	$$(npm bin)/jspm build front_screenshot dist/ig_screenshot.js  --global-name screenShooter  --format umd --skip-source-maps 


update_version:
	@echo "Current version is " ${VERSION}
	@echo "Next version is " $(v)
	sed -i s/"$(VERSION)"/"$(v)"/g package.json

tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags

tag:  build test release

release: update_version tag_and_push