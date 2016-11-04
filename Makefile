VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build



version:
	@echo $(VERSION)

install: 
	npm install
	jspm install --quick

test:
	grunt karma

	
build:
	jspm build src/ig_screenshot dist/ig_screenshot.js  --global-name screenShooter  --skip-source-maps 
	jspm build src/ig_screenshot dist/ig_screenshot.min.js -m --global-name screenShooter  
	jspm build src/ig_screenshot dist/ig_screenshot.bundle.js  --global-name screenShooter  


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

tag: update_version build tag_and_push		

	