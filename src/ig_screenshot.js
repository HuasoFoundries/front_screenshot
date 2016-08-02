"format esm";
import html2canvas from 'html2canvas';
import canvg from 'canvg';

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
	return;
}

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
	console.zdebug('poor clone', clone);
	return clone;
};

var infoScreenShot = function (jqContenedor, callback) {

	jqContenedor.find('.canvg').each(function () {
		screenShooter.svgAImg(jQuery(this));
	});

	var clone = screenShooter.hiddenClone(jqContenedor);

	html2canvas(clone, {
		useCORS: true,
		allowTaint: false,
		logging: false
	}).then(function (canvas) {
		document.body.removeChild(clone);
		console.log('html2canvas done', canvas);
		jQuery('#supercontenedor').css({
			'opacity': '1'
		});
		if (callback) {
			callback(canvas.toDataURL("image/png"));
		}

	});

};


export {
	canvg,
	html2canvas,
	infoScreenShot
};
export default {
	html2canvas: html2canvas,
	canvg: canvg,
	infoScreenShot: infoScreenShot
};
