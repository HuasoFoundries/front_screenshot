'use strict';

import Logger from './Logger';

import { NodeParser } from './NodeParser';
import Renderer from './Renderer';
import ForeignObjectRenderer from './renderer/ForeignObjectRenderer';

import Feature from './Feature';
import { Bounds, parseDocumentSize } from './Bounds';
import { cloneWindow, DocumentCloner } from './Clone';
import { FontMetrics } from './Font';
import Color, { TRANSPARENT } from './Color';

export var renderElement = function renderElement(element, options, logger) {
    var ownerDocument = element.ownerDocument;

    var windowBounds = new Bounds(options.offsetX, options.offsetY, options.windowWidth, options.windowHeight);

    var bounds = options.type === 'view' ? windowBounds : parseDocumentSize(ownerDocument);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    var documentBackgroundColor = ownerDocument.documentElement ? new Color(getComputedStyle(ownerDocument.documentElement).backgroundColor) : TRANSPARENT;
    var bodyBackgroundColor = ownerDocument.body ? new Color(getComputedStyle(ownerDocument.body).backgroundColor) : TRANSPARENT;

    var backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new Color(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new Color(options.backgroundColor) : null;

    // $FlowFixMe
    return Feature.SUPPORT_FOREIGNOBJECT_DRAWING.then(function (supportForeignObject) {
        return supportForeignObject ? function (cloner) {
            if (__DEV__) {
                logger.log('Document cloned, using foreignObject rendering');
            }

            return cloner.imageLoader.ready().then(function () {
                var renderer = new ForeignObjectRenderer(cloner.clonedReferenceElement);
                return renderer.render({
                    bounds: bounds,
                    backgroundColor: backgroundColor,
                    logger: logger,
                    scale: options.scale
                });
            });
        }(new DocumentCloner(element, options, logger, true, renderElement)) : cloneWindow(ownerDocument, windowBounds, element, options, logger, renderElement).then(function (_ref) {
            var _ref2 = babelHelpers.slicedToArray(_ref, 3),
                container = _ref2[0],
                clonedElement = _ref2[1],
                imageLoader = _ref2[2];

            if (__DEV__) {
                logger.log('Document cloned, using computed rendering');
            }

            var stack = NodeParser(clonedElement, imageLoader, logger);
            var clonedDocument = clonedElement.ownerDocument;
            var width = bounds.width;
            var height = bounds.height;

            if (backgroundColor === stack.container.style.background.backgroundColor) {
                stack.container.style.background.backgroundColor = TRANSPARENT;
            }

            return imageLoader.ready().then(function (imageStore) {
                if (options.removeContainer === true) {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                    } else if (__DEV__) {
                        logger.log('Cannot detach cloned iframe as it is not in the DOM anymore');
                    }
                }

                var fontMetrics = new FontMetrics(clonedDocument);
                if (__DEV__) {
                    logger.log('Starting renderer');
                }

                var renderOptions = {
                    backgroundColor: backgroundColor,
                    fontMetrics: fontMetrics,
                    imageStore: imageStore,
                    logger: logger,
                    scale: options.scale,
                    width: width,
                    height: height
                };

                if (Array.isArray(options.target)) {
                    return Promise.all(options.target.map(function (target) {
                        var renderer = new Renderer(target, renderOptions);
                        return renderer.render(stack);
                    }));
                } else {
                    var renderer = new Renderer(options.target, renderOptions);
                    return renderer.render(stack);
                }
            });
        });
    });
};