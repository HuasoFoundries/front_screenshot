'use strict';

import CanvasRenderer from './renderer/CanvasRenderer';
import Logger from './Logger';
import { renderElement } from './Window';

var html2canvas = function html2canvas(element, conf) {
    if ((typeof console === 'undefined' ? 'undefined' : babelHelpers.typeof(console)) === 'object' && typeof console.log === 'function') {
        console.log('html2canvas ' + __VERSION__);
    }

    var config = conf || {};
    var logger = new Logger();

    var ownerDocument = element.ownerDocument;
    var defaultView = ownerDocument.defaultView;

    var defaultOptions = {
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

    var result = renderElement(element, babelHelpers.extends({}, defaultOptions, config), logger);

    if (__DEV__) {
        return result.catch(function (e) {
            logger.error(e);
            throw e;
        });
    }
    return result;
};

html2canvas.CanvasRenderer = CanvasRenderer;

module.exports = html2canvas;