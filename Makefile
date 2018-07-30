VERSION = $(shell cat package.json | sed -n 's/.*"version": "\([^"]*\)",/\1/p')

SHELL = /usr/bin/env bash

default: build
.PHONY: test build rollup rollup_min clean build_full docs



version:
	@echo $(VERSION)

install: 
	npm install
	npm i -D canvg

test:
	$$(npm bin)/karma start
	MINIFIED=true $$(npm bin)/karma start

build_full: clean rollup_canvg rollup_html2canvas build
	
build: rollup rollup_min
	


rollup:
	$$(npm bin)/rollup -c

run:
	$$(npm bin)/serve docs

docs:
	node generate_docs.js	

rollup_min:
	MINIFY=true $$(npm bin)/rollup -c 

rollup_canvg:
	CANVG=true $$(npm bin)/rollup -c 

rollup_html2canvas:
	HTML2CANVAS=true $$(npm bin)/rollup -c 	


clean:
	@rm -rf src/html2canvas.js
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
	sed -i s/'"version": "$(VERSION)"'/'"version": "$(v)"'/g package.json

tag_and_push:
		git add --all
		git commit -a -m "Tag v $(v) $(m)"
		git tag v$(v)
		git push
		git push --tags

tag:  build docs test release

release: test update_version tag_and_push

	