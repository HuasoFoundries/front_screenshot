'use strict';

import FEATURES from './Feature';
import { Proxy } from './Proxy';

// $FlowFixMe
export default class ImageLoader {

    constructor(options, logger, window) {
        this.options = options;
        this._window = window;
        this.origin = this.getOrigin(window.location.href);
        this.cache = {};
        this.logger = logger;
        this._index = 0;
    }

    loadImage(src) {
        if (this.hasImageInCache(src)) {
            return src;
        }

        if (isSVG(src)) {
            if (this.options.allowTaint === true || FEATURES.SUPPORT_SVG_DRAWING) {
                return this.addImage(src, src, false);
            }
        } else {
            if (this.options.allowTaint === true || isInlineBase64Image(src) || this.isSameOrigin(src)) {
                return this.addImage(src, src, false);
            } else if (!this.isSameOrigin(src)) {
                if (typeof this.options.proxy === 'string') {
                    this.cache[src] = Proxy(src, this.options).then(src => loadImage(src, this.options.imageTimeout || 0));
                    return src;
                } else if (this.options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES) {
                    return this.addImage(src, src, true);
                }
            }
        }
    }

    inlineImage(src) {
        if (isInlineImage(src)) {
            return loadImage(src, this.options.imageTimeout || 0);
        }
        if (this.hasImageInCache(src)) {
            return this.cache[src];
        }
        if (!this.isSameOrigin(src) && typeof this.options.proxy === 'string') {
            return this.cache[src] = Proxy(src, this.options).then(src => loadImage(src, this.options.imageTimeout || 0));
        }

        return this.xhrImage(src);
    }

    xhrImage(src) {
        this.cache[src] = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        reject(`Failed to fetch image ${src.substring(0, 256)} with status code ${xhr.status}`);
                    } else {
                        const reader = new FileReader();
                        // $FlowFixMe
                        reader.addEventListener('load', () => resolve(reader.result), false);
                        // $FlowFixMe
                        reader.addEventListener('error', e => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                }
            };
            xhr.responseType = 'blob';
            if (this.options.imageTimeout) {
                const timeout = this.options.imageTimeout;
                xhr.timeout = timeout;
                xhr.ontimeout = () => reject(__DEV__ ? `Timed out (${timeout}ms) fetching ${src.substring(0, 256)}` : '');
            }
            xhr.open('GET', src, true);
            xhr.send();
        }).then(src => loadImage(src, this.options.imageTimeout || 0));

        return this.cache[src];
    }

    loadCanvas(node) {
        const key = String(this._index++);
        this.cache[key] = Promise.resolve(node);
        return key;
    }

    hasImageInCache(key) {
        return typeof this.cache[key] !== 'undefined';
    }

    addImage(key, src, useCORS) {
        if (__DEV__) {
            this.logger.log(`Added image ${key.substring(0, 256)}`);
        }

        const imageLoadHandler = supportsDataImages => new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
            if (!supportsDataImages || useCORS) {
                img.crossOrigin = 'anonymous';
            }

            img.onerror = reject;
            img.src = src;
            if (img.complete === true) {
                // Inline XML images may fail to parse, throwing an Error later on
                setTimeout(() => {
                    resolve(img);
                }, 500);
            }
            if (this.options.imageTimeout) {
                const timeout = this.options.imageTimeout;
                setTimeout(() => reject(__DEV__ ? `Timed out (${timeout}ms) fetching ${src.substring(0, 256)}` : ''), timeout);
            }
        });

        this.cache[key] = isInlineBase64Image(src) && !isSVG(src) ? // $FlowFixMe
        FEATURES.SUPPORT_BASE64_DRAWING(src).then(imageLoadHandler) : imageLoadHandler(true);
        return key;
    }

    isSameOrigin(url) {
        return this.getOrigin(url) === this.origin;
    }

    getOrigin(url) {
        const link = this._link || (this._link = this._window.document.createElement('a'));
        link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }

    ready() {
        const keys = Object.keys(this.cache);
        return Promise.all(keys.map(str => this.cache[str].catch(e => {
            if (__DEV__) {
                this.logger.log(`Unable to load image`, e);
            }
            return null;
        }))).then(images => {
            if (__DEV__) {
                this.logger.log(`Finished loading ${images.length} images`, images);
            }
            return new ImageStore(keys, images);
        });
    }
}

export class ImageStore {

    constructor(keys, images) {
        this._keys = keys;
        this._images = images;
    }

    get(key) {
        const index = this._keys.indexOf(key);
        return index === -1 ? null : this._images[index];
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

const isInlineImage = src => INLINE_IMG.test(src);
const isInlineBase64Image = src => INLINE_BASE64.test(src);

const isSVG = src => src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);

const loadImage = (src, timeout) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        if (img.complete === true) {
            // Inline XML images may fail to parse, throwing an Error later on
            setTimeout(() => {
                resolve(img);
            }, 500);
        }
        if (timeout) {
            setTimeout(() => reject(__DEV__ ? `Timed out (${timeout}ms) loading image` : ''), timeout);
        }
    });
};