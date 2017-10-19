import {
	html2canvas
} from './html2canvas/index.js';
import {
	canvg
}
from './canvg/canvg.js';

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
		quality = 0.5;
	}

	var the_svg = jqContainer.find('svg');

	/*
	This should be done by yourself if you are converting a C3.js graph
	jqContainer.find('g').removeAttr('clip-path');
	jqContainer.find('g.c3-event-rects').remove();
	jqContainer.find('g.c3-grid').remove();
	jqContainer.find('g.c3-regions').remove();
	jqContainer.find('g.c3-axis-y2').remove();
	jqContainer.find('path.domain').attr('stroke-width', 0.5).css('stroke-width', '0.2px');
	*/

	if (the_svg.length === 0) {
		if (fncallback) {
			fncallback();
		}
		return;
	}

	jqContainer
		.find('svg')
		.find('text')
		.css('font', '10px sans-serif');

	jqContainer
		.find('path')
		.attr('fill', 'none');

	// this applies to C3.js grapjs
	jqContainer
		.find('.tick line, path.domain')
		.attr('stroke', 'black');

	var svgData = new XMLSerializer().serializeToString(the_svg[0]);

	the_svg.hide();

	var canvas = document.createElement("canvas");
	canvas.setAttribute('id', 'elcanvas');
	jqContainer[0].appendChild(canvas);

	canvg('elcanvas', svgData, {
		ignoreMouse: true,
		ignoreAnimation: true,
		log: true
	});

	jqContainer.find('.laimg').remove();

	var laimg = new Image();
	laimg.className = 'laimg';
	jqContainer[0].appendChild(laimg);
	laimg.src = canvas.toDataURL("image/png", quality);

	jqContainer.find('#elcanvas').remove();
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
 * @returns {HTMLCanvasElement}  Canvas element
 */
function svgToCanvas(jqContainer, fncallback) {

	var the_svg = jqContainer.find('svg');

	if (the_svg.length === 0) {
		if (fncallback) {
			fncallback();
		}
		return;
	}

	jqContainer
		.find('svg')
		.find('text')
		.css('font', '10px sans-serif');

	jqContainer
		.find('path')
		.attr('fill', 'none');

	// this applies to C3.js grapjs
	jqContainer
		.find('.tick line, path.domain')
		.attr('stroke', 'black');

	jqContainer.find('canvas').remove();

	var tooltip = jqContainer.find('.c3-tooltip-container').detach();

	var content = jqContainer.html().trim();

	var canvas = document.createElement("canvas");
	jqContainer[0].appendChild(canvas);

	the_svg.hide();
	jqContainer.append(tooltip);
	canvg(canvas, content);

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
 * Given a jQuery container, takes a screenshot of it and returns it as an HTMLCanvasElement
 * (it can capture the container contents even if they are hidden due to overlay hidden, auto or scroll CSS properties)
 *
 * @param      {jQuery}  jqContainer  jQuery selector of the element to transform into canvas
 * @param      {Boolean} [clone] if true, then capture contents hidden due to overlay properties
 * @return     {HTMLCanvasElement}  a base64 encoded dataURL
 */
var infoScreenShot = function (jqContainer, clone) {

	var container;
	jqContainer.find('.canvg').each(function () {
		svgToCanvas(jQuery(this));
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
	svgToCanvas
};
export default {
	html2canvas: html2canvas,
	infoScreenShot: infoScreenShot,
	canvg: canvg,
	hiddenClone: hiddenClone,
	svgToImg: svgToImg,
	svgToCanvas: svgToCanvas
};
