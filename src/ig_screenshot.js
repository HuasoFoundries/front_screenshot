import h2c from './html2canvas.js';
import canvg from './canvg.js';
import $ from './cash.esm.js';

/**
 * This module exports front_screenshot, which includes the methods detailed below,
 * plus bundled builds of {@link HTML2Canvas} and {@link Canvg}
 * @module front_screenshot
 */

/**
 * The options that can be passed to every method. Not all of them are needed nor used on every function
 * @typedef {Object} FSOptions
 * @property {Number} [quality=0.8] - level of quality (higher is better) of the image to generate
 * @property {string} [selector='svg'] - Cash/jQuery selector on which to operate e.g. 'svg', '.canvg'
 * @property {boolean} [adjust_styles=true] - if true, sets the styles for typical c3 graphics
 * @property {boolean} [useCORS=true] - tell html2canvas to try to use CORS on external URLs
 * @property {boolean} [allowTaint=false] - either to allow or not tainted objects
 * @property {boolean} [clone=false[] - if true, clone the node to capture and apply html2canvas on the clone
 * @property {Boolean} [logging=false] - if true, log the results of html2canvas or canvg
 * @property {boolean} [clone=false] - if true, clone the node either to adjust styles or to capture with html2canvas
 * @property {boolean} [ignoreMouse=true] - if true, canvg will ignore mouse events
 * @property {boolean} [ignoreAnimation=true] - if true, canvg will ignore svg animations
 * @property {boolean} [hideSVG=true] - if true, hide the svg selector after canvg has converted it to image or canvas
 */

/**
 * Sets the default options.
 *
 * @param  {FSOptions}  options  The options
 * @return {FSOptions}  options with default properties set
 */
function setDefaultOptions(options) {

	if (!options) {
		options = {};
	}
	if (options.quality === undefined) {
		options.quality = 0.8;
	}

	if (options.logging === undefined) {
		options.logging = false;
	}
	if (options.selector === undefined) {
		options.selector = 'svg';
	}

	if (options.hideSVG === undefined) {
		options.hideSVG = true;
	}

	if (options.adjust_styles === undefined) {
		options.adjust_styles = true;
	}

	if (options.useCORS === undefined) {
		options.useCORS = true;
	}

	if (options.allowTaint === undefined) {
		options.allowTaint = false;
	}

	if (options.clone === undefined) {
		options.clone = false;
	}
	if (options.svgContainer === undefined) {
		options.svgContainer = '.canvg';
	}

	if (options.ignoreMouse === undefined) {
		options.ignoreMouse = true;
	}

	if (options.ignoreAnimation === undefined) {
		options.ignoreAnimation = true;
	}

	options.log = options.logging;
	return options;
}

/**
 * Adjust common C3 styles to avoid distorted images. This function won't modify
 * elements with class `keepstyle` not its children
 *
 * @param  {Cash|jQuery|HTMLElement}  jqContainer  The SVG element on which to apply the
 *                                 modifications
 * @param  {FSOptions}       opts   The options, in particular, it will check if `clone` is true
 * @return {Cash|jQuery}  a clone of the original svg element with modified
 *                        styles
 */
function adjustStyles(jqContainer, opts) {

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}

	var clone = opts.clone ? jqContainer.clone() : jqContainer;

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
			'font-weight': '400',
			'font-family': 'sans-serif'
		});

	clone
		.find('.c3-chart-arc')
		.not('.keepstyle')
		.find('text')
		.css({
			'font-size': '13px',
			'font-weight': '400',
			'font-family': 'sans-serif'
		});

	clone.find('.c3-legend-item')
		.not('.keepstyle')
		.find('text')
		.css({
			'font-size': '12px',
			'font-weight': '400',
			'font-family': 'sans-serif'
		});

	return clone;

}

/**
 * Wrapper around html2canvas to accept either a DOMNode or a Cash/jQuery selector
 *
 * @param  {HTMLElement|Cash|jQuery}  jqContainer  The element
 * @param  {FSOptions}  options  The options
 *
 * @returns {HTMLCanvasElement}  Canvas element
 */
function html2canvas(jqContainer, options) {

	var opts = setDefaultOptions(options);

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}

	if (opts.adjust_styles === true) {
		adjustStyles(jqContainer, opts);
	}

	var element = jqContainer[0];

	return new Promise(function (resolve, reject) {
		window.setTimeout(function () {
			h2c(element, opts).then(function (canvas) {
				resolve(canvas);
			}).catch(function (err) {
				reject(err);
			});
		}, 300);
	});

}

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into a canvas
 *
 * @param      {HTMLElement|Cash|jQuery}    jqContainer  container of an SVG element to transform into canvas
 * @param {FSOptions} options - options to pass to canvg
 *
 * @returns {Promise<HTMLCanvasElement>}  a promise that unfolds to a Canvas element
 */
function svgToCanvas(jqContainer, options) {

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}
	var the_svg,
		opts = setDefaultOptions(options);

	if (jqContainer.is('svg')) {
		the_svg = jqContainer;
		jqContainer = the_svg.parent();
	} else {
		the_svg = jqContainer.find(opts.selector);
	}

	var canvas = document.createElement("canvas");
	jqContainer.find('.temporary_element').remove();
	canvas.className = 'temporary_element';

	if (the_svg.length === 0) {
		console.warn(`Requested selector ${opts.selector} not found in document`);
		return Promise.resolve(canvas);
	}

	var clone = the_svg;
	if (opts.adjust_styles === true) {
		clone = adjustStyles(the_svg, opts);
	}

	var tooltip = jqContainer.find('.c3-tooltip-container').detach();

	var svgData;
	if (clone.is('svg')) {
		svgData = new XMLSerializer().serializeToString(clone[0]);
	} else {
		console.warn('Requested element is not an SVG');
		return Promise.resolve(canvas);
	}

	jqContainer[0].appendChild(canvas);
	if (tooltip && tooltip.length) {
		jqContainer.append(tooltip);
	}
	if (opts.hideSVG) {
		the_svg.data('display', the_svg.css('display')).css('display', 'none');
	}

	return new Promise((resolve, reject) => {

		opts.renderCallback = (dom) => {

			resolve(canvas);
		};
		canvg(canvas, svgData, opts);

	});

}
/**
 * Takes a jQuery container, finds its contained SVG, transforms it into an image
 *
 * @param      {HTMLElement|Cash|jQuery}    jqContainer  container of an SVG element to transform into image
 * @param      {FSOptions} [options] options
 *
 * @returns {Promise<HTMLImageElement>} a promise than resolves to an Image element
 */
function svgToImg(jqContainer, options) {

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}
	// kept for retrocompatibility
	if (typeof options === 'number') {
		var quality = options;
		options = {
			quality: quality
		};
	}

	var opts = setDefaultOptions(options);
	var laimg = new Image();

	return svgToCanvas(jqContainer, opts)
		.then((the_canvas) => {
			laimg.className = 'temporary_element';
			if (!the_canvas) {
				return Promise.resolve(laimg);
			}

			return new Promise((resolve, reject) => {

				laimg.onload = () => {

					jqContainer[0].removeChild(the_canvas);
					resolve(laimg);
				};
				jqContainer[0].appendChild(laimg);
				laimg.src = the_canvas.toDataURL("image/png", opts.quality);

			});
		}).catch((err) => {
			console.warn(err);
			return Promise.resolve(laimg);
		});
}

/**
 * Creates a hidden clone of a Cash/jQuery selector and appends it to the screen
 * (allows to capture sections that are hidden due to scrolling behavior)
 *
 * @param      {HTMLElement|Cash|jQuery}  jqContainer  The Cash/jQuery selector of the original container
 * @return     {HTMLElement} the DOM node of the clone
 */
function hiddenClone(jqContainer) {

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}

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
 * Given a jQuery container, takes a screenshot of it and returns it as an HTMLCanvasElement
 * (it can capture the container contents even if they are hidden due to overlay hidden, auto or scroll CSS properties)
 *
 * @param      {HTMLElement|Cash|jQuery}  jqContainer  Cash/jQuery selector of the element to transform into canvas
 * @param      {FSOptions} [options] options to pass to canvg and html2canvas
 * @return     {Promise<HTMLCanvasElement>}  a promise that unfolds to a {@link HTMLCanvasElement}
 */
var infoScreenShot = function (jqContainer, options) {

	var container,
		opts = setDefaultOptions(options);

	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}

	jqContainer.find(opts.svgContainer).each(function () {
		svgToImg($(this), options);
	});

	if (opts.clone) {
		container = hiddenClone(jqContainer);
	} else {
		container = jqContainer[0];
	}

	return html2canvas(container, {
		useCORS: opts.useCORS,
		allowTaint: opts.allowTaint,
		logging: opts.logging
	}).then(function (canvas) {
		if (opts.clone) {
			document.body.removeChild(container);
		}
		jqContainer.find(opts.svgContainer).each(function () {
			$(this).find('.temporary_element').remove();
			var the_svg = $(this).find('svg');
			the_svg.css('display', the_svg.data('display') || 'block');
		});
		return canvas;

	}).catch((err) => {
		console.log('Error on html2canvas', err);
		return null;
	});

};

/**
 * Transforms all contents of `selector` nodes found in `jqContainer`
 * from SVG to images with classname `.temporary_element`. Original SVG element is hidden
 *
 * @param {HTMLElement|Cash|jQuery}  jqContainer  Cash/jQuery selector that contains N nodes with the specified selector
 * @param {string}  selector a CSS selector like `.className` or `#id`
 */
var selectorToImg = function (jqContainer, selector) {
	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}
	var elements = selector ? jqContainer.find(selector) : jqContainer;
	elements.each(function () {
		svgToImg($(this));
	});
};

/**
 * Transforms all contents of `selector` nodes found in `jqContainer`
 * from SVG to canvases with classname `.temporary_element`. Original SVG element is hidden
 *
 * @param {HTMLElement|Cash|jQuery}  jqContainer  Cash/jQuery selector that contains N nodes with the specified selector
 * @param {string}  selector a CSS selector like `.className` or `#id`
 */
var selectorToCanvas = function (jqContainer, selector) {
	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}
	var elements = selector ? jqContainer.find(selector) : jqContainer;
	elements.each(function () {
		svgToCanvas($(this));
	});
};

/**
 * Removes all childs from  `selector` nodes found in `jqContainer`
 * removing elements with classname `.temporary_element` and showing the original SVG
 *
 * @param {HTMLElement|Cash|jQuery}  jqContainer  Cash/jQuery selector that contains N nodes with the specified selector
 * @param {string}  selector a CSS selector like `.className` or `#id`
 */
var selectorToSVG = function (jqContainer, selector) {
	if (jqContainer instanceof HTMLElement) {
		jqContainer = $(jqContainer);
	}
	var elements = selector ? jqContainer.find(selector) : jqContainer;
	elements.each(function () {
		$(this).find('.temporary_element').remove();
		$(this).find('svg').show();
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
