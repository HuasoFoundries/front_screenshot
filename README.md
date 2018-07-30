# Front Screenshot

[![Build Status](https://travis-ci.org/HuasoFoundries/front_screenshot.svg?branch=master)](https://travis-ci.org/HuasoFoundries/front_screenshot)

This library bundles 
 
 - [HTML2Canvas](https://html2canvas.hertzen.com/) 
 - [Canvg](https://github.com/canvg/canvg)
 - [Cash.js](https://github.com/kenwheeler/cash)

Into an library with no dependencies, that can transform SVG elements into images or Canvas elements, and take screenshots of your page 
or sections of it, even if they are hidden due to CSS properties such as overlay scroll, hidden or auto.

## Why?

Basically, because chart libraries such as [C3.js](https://c3js.org/) can style SVG elements with rotation and other transformations that
[HTML2Canvas](https://html2canvas.hertzen.com/) cannot parse. So I combined its features with the ones on [Canvg](https://github.com/canvg/canvg)
to preprocess a given container, transforming each SVG element into an image, then capturing the screenshot, then restoring the original SVG.

Some additions and removal of properties, attributes and classnames where cumbersome to add using native `document.querySelectorAll` methods, so 
I also bundled [Cash.js](https://github.com/kenwheeler/cash), a minimal jQuery alternative that provides just what's needed to manipulate DOM nodes.


## Example

See the online example at: https://huasofoundries.github.io/front_screenshot/

Or, you can also clone this repo, run `make install`, then `make run` from its root and navigate to `http://localhost:5000`.

```sh
git clone https://github.com/HuasoFoundries/front_screenshot.git
cd front_screenshot
make install
make run
```



## API

See [USAGE.md](USAGE.md)

## Install

Install it with 

```sh
npm install front_screenshot
```


or, if you're using [JSPM](https://jspm.io):


```sh
jspm install front_screenshot=npm:front_screenshot
```


```sh
jspm install front_screenshot=github:HuasoFroundries/front_screenshot
```