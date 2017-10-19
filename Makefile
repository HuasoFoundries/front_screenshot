VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build rollup babel rollup_min clean 



version:
	@echo $(VERSION)

install: 
	npm install
	$$(npm bin)/jspm install --quick
	rm jspm_packages/github/niklasvh/html2canvas@master/.babelrc

test:
	$$(npm bin)/karma start
	MINIFIED=true $$(npm bin)/karma start

	
build: clean babel rollup_canvg rollup rollup_min
	


rollup:
	$$(npm bin)/rollup -c

run:
	$$(npm bin)/serve .

rollup_min:
	MINIFY=true $$(npm bin)/rollup -c 

rollup_canvg:
	CANVG=true $$(npm bin)/rollup -c 

babel:
	$$(npm bin)/babel jspm_packages/github/niklasvh/html2canvas@master/src/ -d src/html2canvas
	sed -i s/"__DEV__"/"false"/g src/html2canvas/index.js
	sed -i s/"__VERSION__"/"'1.0.0-alpha.1'"/g src/html2canvas/index.js
	sed -i s/"module.exports = html2canvas;"/"export {html2canvas};"/g src/html2canvas/index.js
	
clean:
	@rm -f jspm_packages/github/niklasvh/html2canvas@master/.babelrc
	@rm -rf src/html2canvas
	@rm -rf src/canvg.js

remove_tag:
ifeq ($(t),)
	$(error you must specify a "t" parameter. e.g. make remove_tag t=v1.0.0)
endif	
	@git tag -d $(t)
	@git push origin :refs/tags/$(t)

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

	