'use strict';

import { ucs2 } from 'punycode';

import { Bounds, parseBounds } from './Bounds';
import { TEXT_DECORATION } from './parsing/textDecoration';

import FEATURES from './Feature';

var UNICODE = /[^\u0000-\u00ff]/;

var hasUnicodeCharacters = function hasUnicodeCharacters(text) {
    return UNICODE.test(text);
};

var encodeCodePoint = function encodeCodePoint(codePoint) {
    return ucs2.encode([codePoint]);
};

export var TextBounds = function TextBounds(text, bounds) {
    babelHelpers.classCallCheck(this, TextBounds);

    this.text = text;
    this.bounds = bounds;
};

export var parseTextBounds = function parseTextBounds(value, parent, node) {
    var codePoints = ucs2.decode(value);
    var letterRendering = parent.style.letterSpacing !== 0 || hasUnicodeCharacters(value);
    var textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
    var length = textList.length;
    var textBounds = [];
    var offset = 0;
    for (var i = 0; i < length; i++) {
        var text = textList[i];
        if (parent.style.textDecoration !== TEXT_DECORATION.NONE || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
            } else {
                var replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(node)));
                node = replacementNode;
            }
        } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    }
    return textBounds;
};

var getWrapperBounds = function getWrapperBounds(node) {
    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    wrapper.appendChild(node.cloneNode(true));
    var parentNode = node.parentNode;
    if (parentNode) {
        parentNode.replaceChild(wrapper, node);
        var bounds = parseBounds(wrapper);
        if (wrapper.firstChild) {
            parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
    }
    return new Bounds(0, 0, 0, 0);
};

var getRangeBounds = function getRangeBounds(node, offset, length) {
    var range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect());
};

var splitWords = function splitWords(codePoints) {
    var words = [];
    var i = 0;
    var onWordBoundary = false;
    var word = void 0;
    while (codePoints.length) {
        if (isWordBoundary(codePoints[i]) === onWordBoundary) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
            }
            onWordBoundary = !onWordBoundary;
            i = 0;
        } else {
            i++;
        }

        if (i >= codePoints.length) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(ucs2.encode(word));
            }
        }
    }
    return words;
};

var isWordBoundary = function isWordBoundary(characterCode) {
    return [32, // <space>
    13, // \r
    10, // \n
    9, // \t
    45 // -
    ].indexOf(characterCode) !== -1;
};