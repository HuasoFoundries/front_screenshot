'use strict';

var _extends = Object.assign || function (target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};

import CanvasRenderer from '../html2canvas_es6/renderer/CanvasRenderer.js';
import Logger from '../html2canvas_es6/Logger.js';
import {
	renderElement
} from '../html2canvas_es6/Window.js';

const html2canvas = (element, conf) => {


	const config = conf || {};
	const logger = new Logger();

	const ownerDocument = element.ownerDocument;
	const defaultView = ownerDocument.defaultView;

	const defaultOptions = {
		async: true,
		allowTaint: false,
		imageTimeout: 15000,
		proxy: null,
		removeContainer: true,
		scale: defaultView.devicePixelRatio || 1,
		target: new CanvasRenderer(config.canvas),
		type: null,
		windowWidth: defaultView.innerWidth,
		windowHeight: defaultView.innerHeight,
		offsetX: defaultView.pageXOffset,
		offsetY: defaultView.pageYOffset
	};

	const result = renderElement(element, _extends({}, defaultOptions, config), logger);


	return result;
};

html2canvas.CanvasRenderer = CanvasRenderer;

export {
	html2canvas
};
