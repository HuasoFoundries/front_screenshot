'use strict';

import Color from './Color';

import { contains } from './Util';
import { parseBackground } from './parsing/background';
import { parseBorder } from './parsing/border';
import { parseBorderRadius } from './parsing/borderRadius';
import { parseDisplay, DISPLAY } from './parsing/display';
import { parseCSSFloat, FLOAT } from './parsing/float';
import { parseFont } from './parsing/font';
import { parseLetterSpacing } from './parsing/letterSpacing';
import { parseOverflow, OVERFLOW } from './parsing/overflow';
import { parsePadding } from './parsing/padding';
import { parsePosition, POSITION } from './parsing/position';
import { parseTextDecoration } from './parsing/textDecoration';
import { parseTextShadow } from './parsing/textShadow';
import { parseTextTransform } from './parsing/textTransform';
import { parseTransform } from './parsing/transform';
import { parseVisibility, VISIBILITY } from './parsing/visibility';
import { parseZIndex } from './parsing/zIndex';

import { parseBounds, parseBoundCurves, calculatePaddingBoxPath } from './Bounds';
import { INPUT_BACKGROUND, INPUT_BORDERS, INPUT_COLOR, getInputBorderRadius, reformatInputBounds } from './Input';

var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

var NodeContainer = function () {
    function NodeContainer(node, parent, imageLoader, index) {
        var _this = this;

        babelHelpers.classCallCheck(this, NodeContainer);

        this.parent = parent;
        this.index = index;
        this.childNodes = [];
        var defaultView = node.ownerDocument.defaultView;
        var style = defaultView.getComputedStyle(node, null);
        var display = parseDisplay(style.display);

        var IS_INPUT = node.type === 'radio' || node.type === 'checkbox';

        var position = parsePosition(style.position);

        this.style = {
            background: IS_INPUT ? INPUT_BACKGROUND : parseBackground(style, imageLoader),
            border: IS_INPUT ? INPUT_BORDERS : parseBorder(style),
            borderRadius: (node instanceof defaultView.HTMLInputElement || node instanceof HTMLInputElement) && IS_INPUT ? getInputBorderRadius(node) : parseBorderRadius(style),
            color: IS_INPUT ? INPUT_COLOR : new Color(style.color),
            display: display,
            float: parseCSSFloat(style.float),
            font: parseFont(style),
            letterSpacing: parseLetterSpacing(style.letterSpacing),
            opacity: parseFloat(style.opacity),
            overflow: INPUT_TAGS.indexOf(node.tagName) === -1 ? parseOverflow(style.overflow) : OVERFLOW.HIDDEN,
            padding: parsePadding(style),
            position: position,
            textDecoration: parseTextDecoration(style),
            textShadow: parseTextShadow(style.textShadow),
            textTransform: parseTextTransform(style.textTransform),
            transform: parseTransform(style),
            visibility: parseVisibility(style.visibility),
            zIndex: parseZIndex(position !== POSITION.STATIC ? style.zIndex : 'auto')
        };

        if (this.isTransformed()) {
            // getBoundingClientRect provides values post-transform, we want them without the transformation
            node.style.transform = 'matrix(1,0,0,1,0,0)';
        }

        // TODO move bound retrieval for all nodes to a later stage?
        if (node.tagName === 'IMG') {
            node.addEventListener('load', function () {
                _this.bounds = parseBounds(node);
                _this.curvedBounds = parseBoundCurves(_this.bounds, _this.style.border, _this.style.borderRadius);
            });
        }
        this.image = getImage(node, imageLoader);
        this.bounds = IS_INPUT ? reformatInputBounds(parseBounds(node)) : parseBounds(node);
        this.curvedBounds = parseBoundCurves(this.bounds, this.style.border, this.style.borderRadius);

        if (__DEV__) {
            this.name = '' + node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + node.className.toString().split(' ').map(function (s) {
                return s.length ? '.' + s : '';
            }).join('');
        }
    }

    babelHelpers.createClass(NodeContainer, [{
        key: 'getClipPaths',
        value: function getClipPaths() {
            var parentClips = this.parent ? this.parent.getClipPaths() : [];
            var isClipped = this.style.overflow === OVERFLOW.HIDDEN || this.style.overflow === OVERFLOW.SCROLL;

            return isClipped ? parentClips.concat([calculatePaddingBoxPath(this.curvedBounds)]) : parentClips;
        }
    }, {
        key: 'isInFlow',
        value: function isInFlow() {
            return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned();
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return !contains(this.style.display, DISPLAY.NONE) && this.style.opacity > 0 && this.style.visibility === VISIBILITY.VISIBLE;
        }
    }, {
        key: 'isAbsolutelyPositioned',
        value: function isAbsolutelyPositioned() {
            return this.style.position !== POSITION.STATIC && this.style.position !== POSITION.RELATIVE;
        }
    }, {
        key: 'isPositioned',
        value: function isPositioned() {
            return this.style.position !== POSITION.STATIC;
        }
    }, {
        key: 'isFloating',
        value: function isFloating() {
            return this.style.float !== FLOAT.NONE;
        }
    }, {
        key: 'isRootElement',
        value: function isRootElement() {
            return this.parent === null;
        }
    }, {
        key: 'isTransformed',
        value: function isTransformed() {
            return this.style.transform !== null;
        }
    }, {
        key: 'isPositionedWithZIndex',
        value: function isPositionedWithZIndex() {
            return this.isPositioned() && !this.style.zIndex.auto;
        }
    }, {
        key: 'isInlineLevel',
        value: function isInlineLevel() {
            return contains(this.style.display, DISPLAY.INLINE) || contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_FLEX) || contains(this.style.display, DISPLAY.INLINE_GRID) || contains(this.style.display, DISPLAY.INLINE_LIST_ITEM) || contains(this.style.display, DISPLAY.INLINE_TABLE);
        }
    }, {
        key: 'isInlineBlockOrInlineTable',
        value: function isInlineBlockOrInlineTable() {
            return contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_TABLE);
        }
    }]);
    return NodeContainer;
}();

export default NodeContainer;


var getImage = function getImage(node, imageLoader) {
    if (node instanceof node.ownerDocument.defaultView.SVGSVGElement || node instanceof SVGSVGElement) {
        var s = new XMLSerializer();
        return imageLoader.loadImage('data:image/svg+xml,' + encodeURIComponent(s.serializeToString(node)));
    }
    switch (node.tagName) {
        case 'IMG':
            // $FlowFixMe
            return imageLoader.loadImage(node.currentSrc || node.src);
        case 'CANVAS':
            // $FlowFixMe
            return imageLoader.loadCanvas(node);
        case 'DIV':
            var iframeKey = node.getAttribute('data-html2canvas-internal-iframe-key');
            if (iframeKey) {
                console.log('ok');
                return iframeKey;
            }
            break;
    }

    return null;
};