import html2canvas from 'html2canvas';
import canvg from 'canvg';

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into an image
 *
 * @param      {jQuery}    jqContenedor  container of an SVG element to transform into image
 * @param      {Function}  [fncallback]    callback function invoked with the canvas element
 * 
 * @returns {HTMLElement}  Image element
 */
function svgAImg(jqContenedor, fncallback) {

	var elsvg = jqContenedor.find('svg');

	if (elsvg.length === 0) {
		if (fncallback) {
			fncallback();
		}
		return;
	}
	jqContenedor.find('g').removeAttr('clip-path');
	jqContenedor.find('g.c3-event-rects').remove();
	jqContenedor.find('g.c3-grid').remove();
	jqContenedor.find('g.c3-regions').remove();
	jqContenedor.find('g.c3-axis-y2').remove();
	jqContenedor.find('path.domain').attr('stroke-width', 0.5).css('stroke-width', '0.2px');

	var svgData = new XMLSerializer().serializeToString(elsvg[0]);

	elsvg.hide();

	var canvas = document.createElement("canvas");
	canvas.setAttribute('id', 'elcanvas');
	jqContenedor[0].appendChild(canvas);

	canvg('elcanvas', svgData, {
		ignoreMouse: true,
		ignoreAnimation: true,
		log: true
	});

	jqContenedor.find('.laimg').remove();

	var laimg = new Image();
	laimg.className = 'laimg';
	jqContenedor[0].appendChild(laimg);
	laimg.src = canvas.toDataURL();

	jqContenedor.find('#elcanvas').remove();
	if (fncallback) {
		fncallback(laimg);
	}
	return laimg;
}

/**
 * Takes a jQuery container, finds its contained SVG, transforms it into a canvas
 *
 * @param      {jQuery}    jqContenedor  container of an SVG element to transform into canvas
 * @param      {Function}  [fncallback]    callback function invoked with the canvas element
 * 
 * @returns {HTMLElement}  Canvas element
 */
function svgACanvas(jqContenedor, fncallback) {

	var elsvg = jqContenedor.find('svg');

	jqContenedor
		.find('svg')
		.css('font', '10px sans-serif');

	jqContenedor
		.find('path')
		.attr('fill', 'none');

	jqContenedor
		.find('.tick line, path.domain')
		.attr('stroke', 'black');

	jqContenedor.find('canvas').remove();

	var tooltip = jqContenedor.find('.c3-tooltip-container').detach();

	var content = jqContenedor.html().trim();

	var canvas = document.createElement("canvas");
	jqContenedor[0].appendChild(canvas);

	elsvg.hide();
	jqContenedor.append(tooltip);
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
 * @param      {jQuery}  jqContenedor  The jQuery selector of the original container
 * @return     {HTMLElemnt} the DOM node of the clone
 */
function hiddenClone(jqContenedor) {
	var clone = jqContenedor[0].cloneNode(true);

	// Position element relatively within the
	// body but still out of the viewport
	var style = clone.style;
	style.position = 'relative';
	style['box-sizing'] = 'content-box';
	style.width = jqContenedor.width() + 'px';
	style.height = jqContenedor.height() + 'px';
	style.top = window.innerHeight + 'px';
	style.left = 0;

	// Append clone to body and return the clone
	document.body.appendChild(clone);
	return clone;
};

/**
 * Takes a jQuery container, takes a screenshot of it and returns a dataurl of the image
 *
 * @param      {jQuery}  jqContenedor  jQuery selector of the element to transform into canvas
 * @return     {String}  a base64 encoded dataURL
 */
var infoScreenShot = function (jqContenedor) {

	jqContenedor.find('.canvg').each(function () {
		svgAImg(jQuery(this));
	});

	var clone = hiddenClone(jqContenedor);

	return html2canvas(clone, {
		useCORS: true,
		allowTaint: false,
		logging: false
	}).then(function (canvas) {
		document.body.removeChild(clone);

		return (canvas.toDataURL("image/png"));

	});

};

export {
	html2canvas,
	infoScreenShot,
	canvg,
	hiddenClone,
	svgAImg,
	svgACanvas
};
export default {
	html2canvas: html2canvas,
	infoScreenShot: infoScreenShot,
	canvg: canvg,
	hiddenClone: hiddenClone,
	svgAImg: svgAImg,
	svgACanvas: svgACanvas
};
