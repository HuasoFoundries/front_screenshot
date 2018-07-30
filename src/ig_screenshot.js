import h2c from './html2canvas.js';
import canvg from './canvg.js';

/**
 * This module exports front_screenshot, which includes the methods detailed below,
 * plus bundled builds of {@link HTML2Canvas} and {@link Canvg}
 * @module front_screenshot
 */

/**
 * Wrapper around html2canvas to accept either a DOMNode or a jQuery selector
 *
 * @param  {HTMLElement|jQuery}  element  The element
 * @param  {Object}  options  The options
 *
 * @returns {HTMLCanvasElement}  Canvas element
 */
function html2canvas(element, options) {
	if (!(element instanceof HTMLElement)) {
		element = element[0];
	}
	return h2c(element, options);
}

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into a canvas
 *
 * @param      {jQuery}    jqContainer  container of an SVG element to transform into canvas
 * @param      {Function}  [fncallback]    callback function invoked with the canvas element
 *
 * @returns {HTMLElement}  Canvas element
 */
function svgToCanvas(jqContainer, fncallback) {

	jqContainer.find('.temp_canvas').remove();

	var elsvg = jqContainer.find('svg');

	var clone = elsvg.clone();

	elsvg.hide();
	elsvg.detach();

	var tooltip = jqContainer.find('.c3-tooltip-container').detach();

	clone.find('g').removeAttr('clip-path');
	clone.find('g.c3-regions').remove();

	clone
		.find('path')
		.not('.keepstyle')
		.attr('fill', 'none');

	clone
		.find('.tick line, path.domain')
		.not('.keepstyle')
		.attr('stroke', 'black');

	clone
		.find('.c3-axis')
		.not('.keepstyle')
		.find('.tick')
		.not('.keepstyle')
		.find('text')
		.css({
			'font-size': '10px',
			'font-weight': '400'
		});

	clone
		.find('.c3-chart-arc')
		.not('.keepstyle')
		.find('text')
		.css({
			'font-size': '13px',
			'font-weight': '400'
		});

	clone.find('.c3-legend-item')
		.not('.keepstyle')
		.find('text')
		.css({
			'font-size': '12px',
			'font-weight': '400'
		});

	var content = new XMLSerializer().serializeToString(clone[0]);

	var canvas = document.createElement("canvas");
	canvas.className = 'temp_canvas';
	jqContainer[0].appendChild(canvas);

	jqContainer.append(tooltip);
	jqContainer.append(elsvg);
	canvg(canvas, content, {
		ignoreMouse: true,
		ignoreAnimation: true,
		log: true
	});

	if (fncallback) {
		fncallback(canvas);
	}
	return canvas;
}

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into an image
 *
 * @param      {jQuery}    jqContainer  container of an SVG element to transform into image
 * @param      {Number} [quality] compression level of the image. By default 0.5
 * @param      {Function}  [fncallback]    callback function invoked with the canvas element
 *
 * @returns {HTMLElement}  Image element
 */
function svgToImg(jqContainer, quality, fncallback) {

	if (quality === undefined || quality === null) {
		quality = 0.8;
	}

	jqContainer.find('.laimg').remove();

	var canvas = svgToCanvas(jqContainer);

	var laimg = new Image();
	laimg.className = 'laimg';
	jqContainer[0].appendChild(laimg);

	laimg.src = canvas.toDataURL("image/png", quality);

	jqContainer.find('.temp_canvas').remove();

	if (fncallback) {
		fncallback(laimg);
	}
	return laimg;
}

/**
 * Creates a hidden clone of a jQuery Selector and appends it to the screen
 * (allows to capture sections that are hidden due to scrolling behavior)
 *
 * @param      {jQuery}  jqContainer  The jQuery selector of the original container
 * @return     {HTMLElemnt} the DOM node of the clone
 */
function hiddenClone(jqContainer) {
	var clone = jqContainer[0].cloneNode(true);

	// Position element relatively within the
	// body but still out of the viewport
	var style = clone.style;
	style.position = 'relative';
	style['box-sizing'] = 'content-box';
	style.width = jqContainer.width() + 'px';
	style.height = jqContainer.height() + 'px';
	style.top = window.innerHeight + 'px';
	style.left = 0;

	// Append clone to body and return the clone
	document.body.appendChild(clone);
	return clone;
}

/**
 * Transforms all contents of `selector` nodes found in `jqContainer`
 * from SVG to images with classname `.laimg`. Original SVG element is hidden
 *
 * @param {string}  jqContainer  jQuery selector that contains N nodes with the specified selector
 * @param {string}  selector a CSS selector like `.className` or `#id`
 */
var selectorToImg = function (jqContainer, selector) {
	jqContainer.find(selector).each(function () {
		svgToImg(jQuery(this));
	});
};

/**
 * Removes all childs from  `selector` nodes found in `jqContainer`
 * removing elements with classnames `.laimg` or `.temp_canvas` and showing the original SVG
 *
 * @param {string}  jqContainer  jQuery selector that contains N nodes with the specified selector
 * @param {string}  selector a CSS selector like `.className` or `#id`
 */
var selectorToSVG = function (jqContainer, selector) {
	jqContainer.find(selector).each(function () {
		$(this).find('.laimg').remove();
		$(this).find('.temp_canvas').remove();
		$(this).find('svg').show();
	});
};

/**
 * Given a jQuery container, takes a screenshot of it and returns it as an HTMLCanvasElement
 * (it can capture the container contents even if they are hidden due to overlay hidden, auto or scroll CSS properties)
 *
 * @param      {jQuery}  jqContainer  jQuery selector of the element to transform into canvas
 * @param      {Boolean} [clone] if true, then capture contents hidden due to overlay properties
 * @return     {Promise<HTMLCanvasElement>}  a promise that unfolds to a {@link HTMLCanvasElement}
 */
var infoScreenShot = function (jqContainer, clone) {

	var container;
	jqContainer.find('.canvg').each(function () {
		svgToImg(jQuery(this));
	});

	if (clone) {
		container = hiddenClone(jqContainer);
	} else {
		container = jqContainer[0];
	}

	return html2canvas(container, {
		useCORS: true,
		allowTaint: false,
		logging: false
	}).then(function (canvas) {
		if (clone) {
			document.body.removeChild(container);
		}
		return canvas;

	});

};

export {
	html2canvas,
	infoScreenShot,
	canvg,
	hiddenClone,
	svgToImg,
	svgToCanvas,
	selectorToImg,
	selectorToSVG
};

export default {
	html2canvas: html2canvas,
	infoScreenShot: infoScreenShot,
	canvg: canvg,
	hiddenClone: hiddenClone,
	svgToImg: svgToImg,
	svgToCanvas: svgToCanvas,
	selectorToImg: selectorToImg,
	selectorToSVG: selectorToSVG
};
