VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build rollup babel rollup_min



version:
	@echo $(VERSION)

install: 
	npm install
	$$(npm bin)/jspm install --quick
	rm jspm_packages/github/niklasvh/html2canvas@master/.babelrc

test:
	$$(npm bin)/grunt karma

	
build: babel rollup rollup_min
	


rollup:
	$$(npm bin)/rollup -c
	

rollup_min:
	$$(npm bin)/rollup -c rollup.config.min.js

babel:
	$$(npm bin)/babel jspm_packages/github/niklasvh/html2canvas@master/src/ -d src/html2canvas
	sed -i s/"__DEV__"/"true"/g src/html2canvas/index.js
	sed -i s/"__VERSION__"/"'1.0.0-alpha.1'"/g src/html2canvas/index.js
	sed -i s/"module.exports = html2canvas;"/"export {html2canvas};"/g src/html2canvas/index.js
	

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

tag:  build test release

release: test update_version tag_and_push

	