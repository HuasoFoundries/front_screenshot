import html2canvas from 'html2canvas';
import canvg from 'canvg';

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into an image
 *
 * @param      {jQuery}    jqContainer  container of an SVG element to transform into image
 * @param      {Function}  [fncallback]    callback function invoked with the canvas element
 * 
 * @returns {HTMLElement}  Image element
 */
function svgToImg(jqContainer, fncallback) {

	jqContainer.find('.laimg').remove();

	var canvas = svgToCanvas(jqContainer);

	var laimg = new Image();
	laimg.className = 'laimg';
	jqContainer[0].appendChild(laimg);

	laimg.src = canvas.toDataURL();

	jqContainer.find('.temp_canvas').remove();

	if (fncallback) {
		fncallback(laimg);
	}
	return laimg;
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
	clone.find('g.c3-grid').remove();
	clone.find('g.c3-regions').remove();
	clone.find('g.c3-axis-y2').remove();

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
		.find('text')
		.css('font-size', '10px');

	clone.find('.c3-legend-item')
		.not('.keepstyle')
		.find('text')
		.css('font-size', '10px');

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
};

/**
 * Takes a jQuery container, takes a screenshot of it and returns a dataurl of the image
 *
 * @param      {jQuery}  jqContainer  jQuery selector of the element to transform into canvas
 * @return     {String}  a base64 encoded dataURL
 */
var infoScreenShot = function (jqContainer) {

	jqContainer.find('.canvg').each(function () {
		svgToImg(jQuery(this));
	});

	var clone = hiddenClone(jqContainer);

	return html2canvas(clone, {
		useCORS: true,
		allowTaint: false,
		logging: false
	}).then(function (canvas) {
		document.body.removeChild(clone);

		return (canvas.toDataURL("image/png"));

	});

};

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
