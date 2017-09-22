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

export const renderElement = (element, options, logger) => {
    const ownerDocument = element.ownerDocument;

    const windowBounds = new Bounds(options.offsetX, options.offsetY, options.windowWidth, options.windowHeight);

    const bounds = options.type === 'view' ? windowBounds : parseDocumentSize(ownerDocument);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const documentBackgroundColor = ownerDocument.documentElement ? new Color(getComputedStyle(ownerDocument.documentElement).backgroundColor) : TRANSPARENT;
    const bodyBackgroundColor = ownerDocument.body ? new Color(getComputedStyle(ownerDocument.body).backgroundColor) : TRANSPARENT;

    const backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new Color(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new Color(options.backgroundColor) : null;

    // $FlowFixMe
    return Feature.SUPPORT_FOREIGNOBJECT_DRAWING.then(supportForeignObject => supportForeignObject ? (cloner => {
        if (__DEV__) {
            logger.log(`Document cloned, using foreignObject rendering`);
        }

        return cloner.imageLoader.ready().then(() => {
            const renderer = new ForeignObjectRenderer(cloner.clonedReferenceElement);
            return renderer.render({
                bounds,
                backgroundColor,
                logger,
                scale: options.scale
            });
        });
    })(new DocumentCloner(element, options, logger, true, renderElement)) : cloneWindow(ownerDocument, windowBounds, element, options, logger, renderElement).then(([container, clonedElement, imageLoader]) => {
        if (__DEV__) {
            logger.log(`Document cloned, using computed rendering`);
        }

        const stack = NodeParser(clonedElement, imageLoader, logger);
        const clonedDocument = clonedElement.ownerDocument;
        const width = bounds.width;
        const height = bounds.height;

        if (backgroundColor === stack.container.style.background.backgroundColor) {
            stack.container.style.background.backgroundColor = TRANSPARENT;
        }

        return imageLoader.ready().then(imageStore => {
            if (options.removeContainer === true) {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                } else if (__DEV__) {
                    logger.log(`Cannot detach cloned iframe as it is not in the DOM anymore`);
                }
            }

            const fontMetrics = new FontMetrics(clonedDocument);
            if (__DEV__) {
                logger.log(`Starting renderer`);
            }

            const renderOptions = {
                backgroundColor,
                fontMetrics,
                imageStore,
                logger,
                scale: options.scale,
                width,
                height
            };

            if (Array.isArray(options.target)) {
                return Promise.all(options.target.map(target => {
                    const renderer = new Renderer(target, renderOptions);
                    return renderer.render(stack);
                }));
            } else {
                const renderer = new Renderer(options.target, renderOptions);
                return renderer.render(stack);
            }
        });
    }));
};