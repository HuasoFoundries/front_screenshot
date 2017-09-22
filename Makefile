VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build rollup babel



version:
	@echo $(VERSION)

install: 
	npm install
	jspm install --quick

test:
	grunt karma

	
build:
	jspm build screenshooter-lib-js dist/ig_screenshot.js --format esm --skip-source-maps 
	jspm build screenshooter-lib-js dist/ig_screenshot.min.js -m --global-name screenShooter  --format umd
	jspm build screenshooter-lib-js dist/ig_screenshot.bundle.js  --global-name screenShooter  --format umd --skip-source-maps 


rollup:
	$$(npm bin)/rollup -c

babel:
	$$(npm bin)/babel jspm_packages/github/niklasvh/html2canvas@master/src/ -d html2canvas


update_version:
ifeq ($(shell expr "${VERSION}" \> "$(v)"),1)
	$(error "v" parameter is lower than current version ${VERSION})
endif
ifeq ($(v),)
	$(error v is undefined)
endif
ifeq (${VERSION},$(v))
	$(error v is already the current version)
endif
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

	