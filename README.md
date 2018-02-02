# Front Screenshot

[![Build Status](https://travis-ci.org/HuasoFoundries/front_screenshot.svg?branch=master)](https://travis-ci.org/HuasoFoundries/front_screenshot)

This library bundles [HTML2Canvas](https://html2canvas.hertzen.com/) and [Canvg](https://github.com/canvg/canvg)
to transform SVG into images or Canvas elements, and take screenshots of your page or sections of it, even if
they are hidden due to CSS properties such as overlay scroll, hidden or auto.

## Example

Clone this repo, run `make install`, then run `make run` from its root and navigate to `http://localhost:5000`.

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