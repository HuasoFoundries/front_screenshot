'use strict';

const PATH = {
    VECTOR: 0,
    BEZIER_CURVE: 1,
    CIRCLE: 2
};

'use strict';

// http://dev.w3.org/csswg/css-color/

const HEX3 = /^#([a-f0-9]{3})$/i;
const hex3 = value => {
    const match = value.match(HEX3);
    if (match) {
        return [parseInt(match[1][0] + match[1][0], 16), parseInt(match[1][1] + match[1][1], 16), parseInt(match[1][2] + match[1][2], 16), null];
    }
    return false;
};

const HEX6 = /^#([a-f0-9]{6})$/i;
const hex6 = value => {
    const match = value.match(HEX6);
    if (match) {
        return [parseInt(match[1].substring(0, 2), 16), parseInt(match[1].substring(2, 4), 16), parseInt(match[1].substring(4, 6), 16), null];
    }
    return false;
};

const RGB = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const rgb = value => {
    const match = value.match(RGB);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), null];
    }
    return false;
};

const RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
const rgba = value => {
    const match = value.match(RGBA);
    if (match && match.length > 4) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
    }
    return false;
};

const fromArray = array => {
    return [Math.min(array[0], 255), Math.min(array[1], 255), Math.min(array[2], 255), array.length > 3 ? array[3] : null];
};

const namedColor = name => {
    const color = NAMED_COLORS[name.toLowerCase()];
    return color ? color : false;
};

class Color {

    constructor(value) {
        const [r, g, b, a] = Array.isArray(value) ? fromArray(value) : hex3(value) || rgb(value) || rgba(value) || namedColor(value) || hex6(value) || [0, 0, 0, null];
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    isTransparent() {
        return this.a === 0;
    }

    toString() {
        return this.a !== null && this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
    }
}

const NAMED_COLORS = {
    transparent: [0, 0, 0, 0],
    aliceblue: [240, 248, 255, null],
    antiquewhite: [250, 235, 215, null],
    aqua: [0, 255, 255, null],
    aquamarine: [127, 255, 212, null],
    azure: [240, 255, 255, null],
    beige: [245, 245, 220, null],
    bisque: [255, 228, 196, null],
    black: [0, 0, 0, null],
    blanchedalmond: [255, 235, 205, null],
    blue: [0, 0, 255, null],
    blueviolet: [138, 43, 226, null],
    brown: [165, 42, 42, null],
    burlywood: [222, 184, 135, null],
    cadetblue: [95, 158, 160, null],
    chartreuse: [127, 255, 0, null],
    chocolate: [210, 105, 30, null],
    coral: [255, 127, 80, null],
    cornflowerblue: [100, 149, 237, null],
    cornsilk: [255, 248, 220, null],
    crimson: [220, 20, 60, null],
    cyan: [0, 255, 255, null],
    darkblue: [0, 0, 139, null],
    darkcyan: [0, 139, 139, null],
    darkgoldenrod: [184, 134, 11, null],
    darkgray: [169, 169, 169, null],
    darkgreen: [0, 100, 0, null],
    darkgrey: [169, 169, 169, null],
    darkkhaki: [189, 183, 107, null],
    darkmagenta: [139, 0, 139, null],
    darkolivegreen: [85, 107, 47, null],
    darkorange: [255, 140, 0, null],
    darkorchid: [153, 50, 204, null],
    darkred: [139, 0, 0, null],
    darksalmon: [233, 150, 122, null],
    darkseagreen: [143, 188, 143, null],
    darkslateblue: [72, 61, 139, null],
    darkslategray: [47, 79, 79, null],
    darkslategrey: [47, 79, 79, null],
    darkturquoise: [0, 206, 209, null],
    darkviolet: [148, 0, 211, null],
    deeppink: [255, 20, 147, null],
    deepskyblue: [0, 191, 255, null],
    dimgray: [105, 105, 105, null],
    dimgrey: [105, 105, 105, null],
    dodgerblue: [30, 144, 255, null],
    firebrick: [178, 34, 34, null],
    floralwhite: [255, 250, 240, null],
    forestgreen: [34, 139, 34, null],
    fuchsia: [255, 0, 255, null],
    gainsboro: [220, 220, 220, null],
    ghostwhite: [248, 248, 255, null],
    gold: [255, 215, 0, null],
    goldenrod: [218, 165, 32, null],
    gray: [128, 128, 128, null],
    green: [0, 128, 0, null],
    greenyellow: [173, 255, 47, null],
    grey: [128, 128, 128, null],
    honeydew: [240, 255, 240, null],
    hotpink: [255, 105, 180, null],
    indianred: [205, 92, 92, null],
    indigo: [75, 0, 130, null],
    ivory: [255, 255, 240, null],
    khaki: [240, 230, 140, null],
    lavender: [230, 230, 250, null],
    lavenderblush: [255, 240, 245, null],
    lawngreen: [124, 252, 0, null],
    lemonchiffon: [255, 250, 205, null],
    lightblue: [173, 216, 230, null],
    lightcoral: [240, 128, 128, null],
    lightcyan: [224, 255, 255, null],
    lightgoldenrodyellow: [250, 250, 210, null],
    lightgray: [211, 211, 211, null],
    lightgreen: [144, 238, 144, null],
    lightgrey: [211, 211, 211, null],
    lightpink: [255, 182, 193, null],
    lightsalmon: [255, 160, 122, null],
    lightseagreen: [32, 178, 170, null],
    lightskyblue: [135, 206, 250, null],
    lightslategray: [119, 136, 153, null],
    lightslategrey: [119, 136, 153, null],
    lightsteelblue: [176, 196, 222, null],
    lightyellow: [255, 255, 224, null],
    lime: [0, 255, 0, null],
    limegreen: [50, 205, 50, null],
    linen: [250, 240, 230, null],
    magenta: [255, 0, 255, null],
    maroon: [128, 0, 0, null],
    mediumaquamarine: [102, 205, 170, null],
    mediumblue: [0, 0, 205, null],
    mediumorchid: [186, 85, 211, null],
    mediumpurple: [147, 112, 219, null],
    mediumseagreen: [60, 179, 113, null],
    mediumslateblue: [123, 104, 238, null],
    mediumspringgreen: [0, 250, 154, null],
    mediumturquoise: [72, 209, 204, null],
    mediumvioletred: [199, 21, 133, null],
    midnightblue: [25, 25, 112, null],
    mintcream: [245, 255, 250, null],
    mistyrose: [255, 228, 225, null],
    moccasin: [255, 228, 181, null],
    navajowhite: [255, 222, 173, null],
    navy: [0, 0, 128, null],
    oldlace: [253, 245, 230, null],
    olive: [128, 128, 0, null],
    olivedrab: [107, 142, 35, null],
    orange: [255, 165, 0, null],
    orangered: [255, 69, 0, null],
    orchid: [218, 112, 214, null],
    palegoldenrod: [238, 232, 170, null],
    palegreen: [152, 251, 152, null],
    paleturquoise: [175, 238, 238, null],
    palevioletred: [219, 112, 147, null],
    papayawhip: [255, 239, 213, null],
    peachpuff: [255, 218, 185, null],
    peru: [205, 133, 63, null],
    pink: [255, 192, 203, null],
    plum: [221, 160, 221, null],
    powderblue: [176, 224, 230, null],
    purple: [128, 0, 128, null],
    rebeccapurple: [102, 51, 153, null],
    red: [255, 0, 0, null],
    rosybrown: [188, 143, 143, null],
    royalblue: [65, 105, 225, null],
    saddlebrown: [139, 69, 19, null],
    salmon: [250, 128, 114, null],
    sandybrown: [244, 164, 96, null],
    seagreen: [46, 139, 87, null],
    seashell: [255, 245, 238, null],
    sienna: [160, 82, 45, null],
    silver: [192, 192, 192, null],
    skyblue: [135, 206, 235, null],
    slateblue: [106, 90, 205, null],
    slategray: [112, 128, 144, null],
    slategrey: [112, 128, 144, null],
    snow: [255, 250, 250, null],
    springgreen: [0, 255, 127, null],
    steelblue: [70, 130, 180, null],
    tan: [210, 180, 140, null],
    teal: [0, 128, 128, null],
    thistle: [216, 191, 216, null],
    tomato: [255, 99, 71, null],
    turquoise: [64, 224, 208, null],
    violet: [238, 130, 238, null],
    wheat: [245, 222, 179, null],
    white: [255, 255, 255, null],
    whitesmoke: [245, 245, 245, null],
    yellow: [255, 255, 0, null],
    yellowgreen: [154, 205, 50, null]
};

const TRANSPARENT = new Color([0, 0, 0, 0]);

'use strict';

const TEXT_DECORATION_STYLE = {
    SOLID: 0,
    DOUBLE: 1,
    DOTTED: 2,
    DASHED: 3,
    WAVY: 4
};

const TEXT_DECORATION = {
    NONE: null
};

const TEXT_DECORATION_LINE = {
    UNDERLINE: 1,
    OVERLINE: 2,
    LINE_THROUGH: 3,
    BLINK: 4
};

const parseLine = line => {
    switch (line) {
        case 'underline':
            return TEXT_DECORATION_LINE.UNDERLINE;
        case 'overline':
            return TEXT_DECORATION_LINE.OVERLINE;
        case 'line-through':
            return TEXT_DECORATION_LINE.LINE_THROUGH;
    }
    return TEXT_DECORATION_LINE.BLINK;
};

const parseTextDecorationLine = line => {
    if (line === 'none') {
        return null;
    }

    return line.split(' ').map(parseLine);
};

const parseTextDecorationStyle = style => {
    switch (style) {
        case 'double':
            return TEXT_DECORATION_STYLE.DOUBLE;
        case 'dotted':
            return TEXT_DECORATION_STYLE.DOTTED;
        case 'dashed':
            return TEXT_DECORATION_STYLE.DASHED;
        case 'wavy':
            return TEXT_DECORATION_STYLE.WAVY;
    }
    return TEXT_DECORATION_STYLE.SOLID;
};

const parseTextDecoration = style => {
    const textDecorationLine = parseTextDecorationLine(style.textDecorationLine ? style.textDecorationLine : style.textDecoration);
    if (textDecorationLine === null) {
        return TEXT_DECORATION.NONE;
    }

    const textDecorationColor = style.textDecorationColor ? new Color(style.textDecorationColor) : null;
    const textDecorationStyle = parseTextDecorationStyle(style.textDecorationStyle);

    return {
        textDecorationLine,
        textDecorationColor,
        textDecorationStyle
    };
};

'use strict';

class CanvasRenderer {

    constructor(canvas) {
        this.canvas = canvas ? canvas : document.createElement('canvas');
    }

    render(options) {
        this.ctx = this.canvas.getContext('2d');
        this.options = options;
        this.canvas.width = Math.floor(options.width * options.scale);
        this.canvas.height = Math.floor(options.height * options.scale);
        this.canvas.style.width = `${options.width}px`;
        this.canvas.style.height = `${options.height}px`;

        this.ctx.scale(this.options.scale, this.options.scale);
        this.ctx.textBaseline = 'bottom';
        options.logger.log(`Canvas renderer initialized with scale ${this.options.scale}`);
    }

    clip(clipPaths, callback) {
        if (clipPaths.length) {
            this.ctx.save();
            clipPaths.forEach(path => {
                this.path(path);
                this.ctx.clip();
            });
        }

        callback();

        if (clipPaths.length) {
            this.ctx.restore();
        }
    }

    drawImage(image, source, destination) {
        this.ctx.drawImage(image, source.left, source.top, source.width, source.height, destination.left, destination.top, destination.width, destination.height);
    }

    drawShape(path, color) {
        this.path(path);
        this.ctx.fillStyle = color.toString();
        this.ctx.fill();
    }

    fill(color) {
        this.ctx.fillStyle = color.toString();
        this.ctx.fill();
    }

    getTarget() {
        return Promise.resolve(this.canvas);
    }

    path(path) {
        this.ctx.beginPath();
        if (Array.isArray(path)) {
            path.forEach((point, index) => {
                const start = point.type === PATH.VECTOR ? point : point.start;
                if (index === 0) {
                    this.ctx.moveTo(start.x, start.y);
                } else {
                    this.ctx.lineTo(start.x, start.y);
                }

                if (point.type === PATH.BEZIER_CURVE) {
                    this.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
                }
            });
        } else {
            this.ctx.arc(path.x + path.radius, path.y + path.radius, path.radius, 0, Math.PI * 2, true);
        }

        this.ctx.closePath();
    }

    rectangle(x, y, width, height, color) {
        this.ctx.fillStyle = color.toString();
        this.ctx.fillRect(x, y, width, height);
    }

    renderLinearGradient(bounds, gradient) {
        const linearGradient = this.ctx.createLinearGradient(bounds.left + gradient.direction.x1, bounds.top + gradient.direction.y1, bounds.left + gradient.direction.x0, bounds.top + gradient.direction.y0);

        gradient.colorStops.forEach(colorStop => {
            linearGradient.addColorStop(colorStop.stop, colorStop.color.toString());
        });

        this.ctx.fillStyle = linearGradient;
        this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
    }

    renderRepeat(path, image, imageSize, offsetX, offsetY) {
        this.path(path);
        this.ctx.fillStyle = this.ctx.createPattern(this.resizeImage(image, imageSize), 'repeat');
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fill();
        this.ctx.translate(-offsetX, -offsetY);
    }

    renderTextNode(textBounds, color, font, textDecoration, textShadows) {
        this.ctx.font = [font.fontStyle, font.fontVariant, font.fontWeight, font.fontSize, font.fontFamily].join(' ').split(',')[0];

        textBounds.forEach(text => {
            this.ctx.fillStyle = color.toString();
            if (textShadows && text.text.trim().length) {
                textShadows.slice(0).reverse().forEach(textShadow => {
                    this.ctx.shadowColor = textShadow.color.toString();
                    this.ctx.shadowOffsetX = textShadow.offsetX * this.options.scale;
                    this.ctx.shadowOffsetY = textShadow.offsetY * this.options.scale;
                    this.ctx.shadowBlur = textShadow.blur;

                    this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
                });
            } else {
                this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
            }

            if (textDecoration !== null) {
                const textDecorationColor = textDecoration.textDecorationColor || color;
                textDecoration.textDecorationLine.forEach(textDecorationLine => {
                    switch (textDecorationLine) {
                        case TEXT_DECORATION_LINE.UNDERLINE:
                            // Draws a line at the baseline of the font
                            // TODO As some browsers display the line as more than 1px if the font-size is big,
                            // need to take that into account both in position and size
                            const { baseline } = this.options.fontMetrics.getMetrics(font);
                            this.rectangle(text.bounds.left, Math.round(text.bounds.top + baseline), text.bounds.width, 1, textDecorationColor);
                            break;
                        case TEXT_DECORATION_LINE.OVERLINE:
                            this.rectangle(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1, textDecorationColor);
                            break;
                        case TEXT_DECORATION_LINE.LINE_THROUGH:
                            // TODO try and find exact position for line-through
                            const { middle } = this.options.fontMetrics.getMetrics(font);
                            this.rectangle(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1, textDecorationColor);
                            break;
                    }
                });
            }
        });
    }

    resizeImage(image, size) {
        if (image.width === size.width && image.height === size.height) {
            return image;
        }

        const canvas = this.canvas.ownerDocument.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
        return canvas;
    }

    setOpacity(opacity) {
        this.ctx.globalAlpha = opacity;
    }

    transform(offsetX, offsetY, matrix, callback) {
        this.ctx.save();
        this.ctx.translate(offsetX, offsetY);
        this.ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        this.ctx.translate(-offsetX, -offsetY);

        callback();

        this.ctx.restore();
    }
}

'use strict';

class Logger {

    constructor(id, start) {
        this.start = start ? start : Date.now();
        this.id = id;
    }

    child(id) {
        return new Logger(id, this.start);
    }

    // eslint-disable-next-line flowtype/no-weak-types
    log(...args) {
        if (window.console && window.console.log) {
            Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? `html2canvas (${this.id}):` : 'html2canvas:'].concat([].slice.call(args, 0)));
        }
    }

    // eslint-disable-next-line flowtype/no-weak-types
    error(...args) {
        if (window.console && window.console.error) {
            Function.prototype.bind.call(window.console.error, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? `html2canvas (${this.id}):` : 'html2canvas:'].concat([].slice.call(args, 0)));
        }
    }
}

'use strict';

const contains = (bit, value) => (bit & value) !== 0;

const copyCSSStyles = (style, target) => {
    // Edge does not provide value for cssText
    for (let i = style.length - 1; i >= 0; i--) {
        const property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content') {
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
    return target;
};

const SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

'use strict';

const LENGTH_TYPE = {
    PX: 0,
    PERCENTAGE: 1
};

class Length {

    constructor(value) {
        this.type = value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
        const parsedValue = parseFloat(value);
        if (__DEV__ && isNaN(parsedValue)) {
            console.error(`Invalid value given for Length: "${value}"`);
        }
        this.value = isNaN(parsedValue) ? 0 : parsedValue;
    }

    isPercentage() {
        return this.type === LENGTH_TYPE.PERCENTAGE;
    }

    getAbsoluteValue(parentLength) {
        return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
    }

    static create(v) {
        return new Length(v);
    }
}

'use strict';

class Size {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

'use strict';

class Vector {

    constructor(x, y) {
        this.type = PATH.VECTOR;
        this.x = x;
        this.y = y;
        if (__DEV__) {
            if (isNaN(x)) {
                console.error(`Invalid x value given for Vector`);
            }
            if (isNaN(y)) {
                console.error(`Invalid y value given for Vector`);
            }
        }
    }
}

'use strict';

const lerp = (a, b, t) => {
    return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

class BezierCurve {

    constructor(start, startControl, endControl, end) {
        this.type = PATH.BEZIER_CURVE;
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
    }

    subdivide(t, firstHalf) {
        const ab = lerp(this.start, this.startControl, t);
        const bc = lerp(this.startControl, this.endControl, t);
        const cd = lerp(this.endControl, this.end, t);
        const abbc = lerp(ab, bc, t);
        const bccd = lerp(bc, cd, t);
        const dest = lerp(abbc, bccd, t);
        return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
    }

    reverse() {
        return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
    }
}

'use strict';

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;

const H = 0;
const V = 1;

class Bounds {

    constructor(x, y, w, h) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }

    static fromClientRect(clientRect) {
        return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    }
}

const parseBounds = node => {
    return Bounds.fromClientRect(node.getBoundingClientRect());
};

const calculatePaddingBox = (bounds, borders) => {
    return new Bounds(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth));
};

const calculateContentBox = (bounds, padding, borders) => {
    // TODO support percentage paddings
    const paddingTop = padding[TOP].value;
    const paddingRight = padding[RIGHT].value;
    const paddingBottom = padding[BOTTOM].value;
    const paddingLeft = padding[LEFT].value;

    return new Bounds(bounds.left + paddingLeft + borders[LEFT].borderWidth, bounds.top + paddingTop + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth + paddingLeft + paddingRight), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth + paddingTop + paddingBottom));
};

const parseDocumentSize = document => {
    const body = document.body;
    const documentElement = document.documentElement;

    if (!body || !documentElement) {
        throw new Error(__DEV__ ? `Unable to get document size` : '');
    }
    const width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));

    const height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));

    return new Bounds(0, 0, width, height);
};

const parsePathForBorder = (curves, borderSide) => {
    switch (borderSide) {
        case TOP:
            return createPathFromCurves(curves.topLeftOuter, curves.topLeftInner, curves.topRightOuter, curves.topRightInner);
        case RIGHT:
            return createPathFromCurves(curves.topRightOuter, curves.topRightInner, curves.bottomRightOuter, curves.bottomRightInner);
        case BOTTOM:
            return createPathFromCurves(curves.bottomRightOuter, curves.bottomRightInner, curves.bottomLeftOuter, curves.bottomLeftInner);
        case LEFT:
        default:
            return createPathFromCurves(curves.bottomLeftOuter, curves.bottomLeftInner, curves.topLeftOuter, curves.topLeftInner);
    }
};

const createPathFromCurves = (outer1, inner1, outer2, inner2) => {
    const path = [];
    if (outer1 instanceof BezierCurve) {
        path.push(outer1.subdivide(0.5, false));
    } else {
        path.push(outer1);
    }

    if (outer2 instanceof BezierCurve) {
        path.push(outer2.subdivide(0.5, true));
    } else {
        path.push(outer2);
    }

    if (inner2 instanceof BezierCurve) {
        path.push(inner2.subdivide(0.5, true).reverse());
    } else {
        path.push(inner2);
    }

    if (inner1 instanceof BezierCurve) {
        path.push(inner1.subdivide(0.5, false).reverse());
    } else {
        path.push(inner1);
    }

    return path;
};

const calculateBorderBoxPath = curves => {
    return [curves.topLeftOuter, curves.topRightOuter, curves.bottomRightOuter, curves.bottomLeftOuter];
};

const calculatePaddingBoxPath = curves => {
    return [curves.topLeftInner, curves.topRightInner, curves.bottomRightInner, curves.bottomLeftInner];
};

const parseBoundCurves = (bounds, borders, borderRadius) => {
    const HALF_WIDTH = bounds.width / 2;
    const HALF_HEIGHT = bounds.height / 2;
    const tlh = borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    const tlv = borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    const trh = borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    const trv = borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    const brh = borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    const brv = borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    const blh = borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    const blv = borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;

    const topWidth = bounds.width - trh;
    const rightHeight = bounds.height - brv;
    const bottomWidth = bounds.width - brh;
    const leftHeight = bounds.height - blv;

    return {
        topLeftOuter: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT) : new Vector(bounds.left, bounds.top),
        topLeftInner: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, Math.max(0, tlh - borders[LEFT].borderWidth), Math.max(0, tlv - borders[TOP].borderWidth), CORNER.TOP_LEFT) : new Vector(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth),
        topRightOuter: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top),
        topRightInner: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borders[LEFT].borderWidth), bounds.top + borders[TOP].borderWidth, topWidth > bounds.width + borders[LEFT].borderWidth ? 0 : trh - borders[LEFT].borderWidth, trv - borders[TOP].borderWidth, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + borders[TOP].borderWidth),
        bottomRightOuter: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
        bottomRightInner: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borders[LEFT].borderWidth), bounds.top + Math.min(rightHeight, bounds.height + borders[TOP].borderWidth), Math.max(0, brh - borders[RIGHT].borderWidth), brv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth),
        bottomLeftOuter: blh > 0 || blv > 0 ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT) : new Vector(bounds.left, bounds.top + bounds.height),
        bottomLeftInner: blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + leftHeight, Math.max(0, blh - borders[LEFT].borderWidth), blv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borders[LEFT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth)
    };
};

const CORNER = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3
};

const getCurvePoints = (x, y, r1, r2, position) => {
    const kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    const ox = r1 * kappa; // control point offset horizontal
    const oy = r2 * kappa; // control point offset vertical
    const xm = x + r1; // x-middle
    const ym = y + r2; // y-middle

    switch (position) {
        case CORNER.TOP_LEFT:
            return new BezierCurve(new Vector(x, ym), new Vector(x, ym - oy), new Vector(xm - ox, y), new Vector(xm, y));
        case CORNER.TOP_RIGHT:
            return new BezierCurve(new Vector(x, y), new Vector(x + ox, y), new Vector(xm, ym - oy), new Vector(xm, ym));
        case CORNER.BOTTOM_RIGHT:
            return new BezierCurve(new Vector(xm, y), new Vector(xm, y + oy), new Vector(x + ox, ym), new Vector(x, ym));
        case CORNER.BOTTOM_LEFT:
        default:
            return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x, y + oy), new Vector(x, y));
    }
};

'use strict';

const BACKGROUND_REPEAT = {
    REPEAT: 0,
    NO_REPEAT: 1,
    REPEAT_X: 2,
    REPEAT_Y: 3
};

const BACKGROUND_SIZE = {
    AUTO: 0,
    CONTAIN: 1,
    COVER: 2,
    LENGTH: 3
};

const BACKGROUND_CLIP = {
    BORDER_BOX: 0,
    PADDING_BOX: 1,
    CONTENT_BOX: 2
};

const BACKGROUND_ORIGIN = BACKGROUND_CLIP;

const AUTO = 'auto';

class BackgroundSize {

    constructor(size) {
        switch (size) {
            case 'contain':
                this.size = BACKGROUND_SIZE.CONTAIN;
                break;
            case 'cover':
                this.size = BACKGROUND_SIZE.COVER;
                break;
            case 'auto':
                this.size = BACKGROUND_SIZE.AUTO;
                break;
            default:
                this.value = new Length(size);
        }
    }
}

const calculateBackgroundSize = (backgroundImage, image, bounds) => {
    let width = 0;
    let height = 0;
    const size = backgroundImage.size;
    if (size[0].size === BACKGROUND_SIZE.CONTAIN || size[0].size === BACKGROUND_SIZE.COVER) {
        const targetRatio = bounds.width / bounds.height;
        const currentRatio = image.width / image.height;
        return targetRatio < currentRatio !== (size[0].size === BACKGROUND_SIZE.COVER) ? new Size(bounds.width, bounds.width / currentRatio) : new Size(bounds.height * currentRatio, bounds.height);
    }

    if (size[0].value) {
        width = size[0].value.getAbsoluteValue(bounds.width);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO && size[1].size === BACKGROUND_SIZE.AUTO) {
        height = image.height;
    } else if (size[1].size === BACKGROUND_SIZE.AUTO) {
        height = width / image.width * image.height;
    } else if (size[1].value) {
        height = size[1].value.getAbsoluteValue(bounds.height);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO) {
        width = height / image.height * image.width;
    }

    return new Size(width, height);
};

const AUTO_SIZE = new BackgroundSize(AUTO);

const calculateBackgroungPaintingArea = (curves, clip) => {
    // TODO support CONTENT_BOX
    switch (clip) {
        case BACKGROUND_CLIP.BORDER_BOX:
            return calculateBorderBoxPath(curves);
        case BACKGROUND_CLIP.PADDING_BOX:
        default:
            return calculatePaddingBoxPath(curves);
    }
};

const calculateBackgroundPosition = (position, size, bounds) => {
    return new Vector(position[0].getAbsoluteValue(bounds.width - size.width), position[1].getAbsoluteValue(bounds.height - size.height));
};

const calculateBackgroundRepeatPath = (background, position, size, backgroundPositioningArea, bounds) => {
    const repeat = background.repeat;
    switch (repeat) {
        case BACKGROUND_REPEAT.REPEAT_X:
            return [new Vector(Math.round(bounds.left), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left + bounds.width), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left + bounds.width), Math.round(size.height + backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left), Math.round(size.height + backgroundPositioningArea.top + position.y))];
        case BACKGROUND_REPEAT.REPEAT_Y:
            return [new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.height + bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.height + bounds.top))];
        case BACKGROUND_REPEAT.NO_REPEAT:
            return [new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y + size.height)), new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y + size.height))];
        default:
            return [new Vector(Math.round(bounds.left), Math.round(bounds.top)), new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.top)), new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.height + bounds.top)), new Vector(Math.round(bounds.left), Math.round(bounds.height + bounds.top))];
    }
};

const parseBackground = (style, imageLoader) => {
    return {
        backgroundColor: new Color(style.backgroundColor),
        backgroundImage: parseBackgroundImages(style, imageLoader),
        backgroundClip: parseBackgroundClip(style.backgroundClip),
        backgroundOrigin: parseBackgroundOrigin(style.backgroundOrigin)
    };
};

const parseBackgroundClip = backgroundClip => {
    switch (backgroundClip) {
        case 'padding-box':
            return BACKGROUND_CLIP.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_CLIP.CONTENT_BOX;
    }
    return BACKGROUND_CLIP.BORDER_BOX;
};

const parseBackgroundOrigin = backgroundOrigin => {
    switch (backgroundOrigin) {
        case 'padding-box':
            return BACKGROUND_ORIGIN.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_ORIGIN.CONTENT_BOX;
    }
    return BACKGROUND_ORIGIN.BORDER_BOX;
};

const parseBackgroundRepeat = backgroundRepeat => {
    switch (backgroundRepeat.trim()) {
        case 'no-repeat':
            return BACKGROUND_REPEAT.NO_REPEAT;
        case 'repeat-x':
        case 'repeat no-repeat':
            return BACKGROUND_REPEAT.REPEAT_X;
        case 'repeat-y':
        case 'no-repeat repeat':
            return BACKGROUND_REPEAT.REPEAT_Y;
        case 'repeat':
            return BACKGROUND_REPEAT.REPEAT;
    }

    if (__DEV__) {
        console.error(`Invalid background-repeat value "${backgroundRepeat}"`);
    }

    return BACKGROUND_REPEAT.REPEAT;
};

const parseBackgroundImages = (style, imageLoader) => {
    const sources = parseBackgroundImage(style.backgroundImage).map(backgroundImage => {
        if (backgroundImage.method === 'url') {
            const key = imageLoader.loadImage(backgroundImage.args[0]);
            backgroundImage.args = key ? [key] : [];
        }
        return backgroundImage;
    });
    const positions = style.backgroundPosition.split(',');
    const repeats = style.backgroundRepeat.split(',');
    const sizes = style.backgroundSize.split(',');

    return sources.map((source, index) => {
        const size = (sizes[index] || AUTO).trim().split(' ').map(parseBackgroundSize);
        const position = (positions[index] || AUTO).trim().split(' ').map(parseBackgoundPosition);

        return {
            source,
            repeat: parseBackgroundRepeat(typeof repeats[index] === 'string' ? repeats[index] : repeats[0]),
            size: size.length < 2 ? [size[0], AUTO_SIZE] : [size[0], size[1]],
            position: position.length < 2 ? [position[0], position[0]] : [position[0], position[1]]
        };
    });
};

const parseBackgroundSize = size => size === 'auto' ? AUTO_SIZE : new BackgroundSize(size);

const parseBackgoundPosition = position => {
    switch (position) {
        case 'bottom':
        case 'right':
            return new Length('100%');
        case 'left':
        case 'top':
            return new Length('0%');
        case 'auto':
            return new Length('0');
    }
    return new Length(position);
};

const parseBackgroundImage = image => {
    const whitespace = /^\s$/;
    const results = [];

    let args = [];
    let method = '';
    let quote = null;
    let definition = '';
    let mode = 0;
    let numParen = 0;

    const appendResult = () => {
        let prefix = '';
        if (method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }

            if (definition) {
                args.push(definition.trim());
            }

            const prefix_i = method.indexOf('-', 1) + 1;
            if (method.substr(0, 1) === '-' && prefix_i > 0) {
                prefix = method.substr(0, prefix_i).toLowerCase();
                method = method.substr(prefix_i);
            }
            method = method.toLowerCase();
            if (method !== 'none') {
                results.push({
                    prefix,
                    method,
                    args
                });
            }
        }
        args = [];
        method = definition = '';
    };

    image.split('').forEach(c => {
        if (mode === 0 && whitespace.test(c)) {
            return;
        }
        switch (c) {
            case '"':
                if (!quote) {
                    quote = c;
                } else if (quote === c) {
                    quote = null;
                }
                break;
            case '(':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    mode = 1;
                    return;
                } else {
                    numParen++;
                }
                break;
            case ')':
                if (quote) {
                    break;
                } else if (mode === 1) {
                    if (numParen === 0) {
                        mode = 0;
                        appendResult();
                        return;
                    } else {
                        numParen--;
                    }
                }
                break;

            case ',':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    appendResult();
                    return;
                } else if (mode === 1) {
                    if (numParen === 0 && !method.match(/^url$/i)) {
                        args.push(definition.trim());
                        definition = '';
                        return;
                    }
                }
                break;
        }

        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();
    return results;
};

'use strict';

const BORDER_STYLE = {
    NONE: 0,
    SOLID: 1
};

const BORDER_SIDES = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

const SIDES = Object.keys(BORDER_SIDES).map(s => s.toLowerCase());

const parseBorderStyle = style => {
    switch (style) {
        case 'none':
            return BORDER_STYLE.NONE;
    }
    return BORDER_STYLE.SOLID;
};

const parseBorder = style => {
    return SIDES.map(side => {
        const borderColor = new Color(style.getPropertyValue(`border-${side}-color`));
        const borderStyle = parseBorderStyle(style.getPropertyValue(`border-${side}-style`));
        const borderWidth = parseFloat(style.getPropertyValue(`border-${side}-width`));
        return {
            borderColor,
            borderStyle,
            borderWidth: isNaN(borderWidth) ? 0 : borderWidth
        };
    });
};

'use strict';

const SIDES$1 = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

const parseBorderRadius = style => {
    return SIDES$1.map(side => {
        const value = style.getPropertyValue(`border-${side}-radius`);
        const [horizontal, vertical] = value.split(' ').map(Length.create);
        return typeof vertical === 'undefined' ? [horizontal, horizontal] : [horizontal, vertical];
    });
};

'use strict';

const DISPLAY = {
    NONE: 1 << 0,
    BLOCK: 1 << 1,
    INLINE: 1 << 2,
    RUN_IN: 1 << 3,
    FLOW: 1 << 4,
    FLOW_ROOT: 1 << 5,
    TABLE: 1 << 6,
    FLEX: 1 << 7,
    GRID: 1 << 8,
    RUBY: 1 << 9,
    SUBGRID: 1 << 10,
    LIST_ITEM: 1 << 11,
    TABLE_ROW_GROUP: 1 << 12,
    TABLE_HEADER_GROUP: 1 << 13,
    TABLE_FOOTER_GROUP: 1 << 14,
    TABLE_ROW: 1 << 15,
    TABLE_CELL: 1 << 16,
    TABLE_COLUMN_GROUP: 1 << 17,
    TABLE_COLUMN: 1 << 18,
    TABLE_CAPTION: 1 << 19,
    RUBY_BASE: 1 << 20,
    RUBY_TEXT: 1 << 21,
    RUBY_BASE_CONTAINER: 1 << 22,
    RUBY_TEXT_CONTAINER: 1 << 23,
    CONTENTS: 1 << 24,
    INLINE_BLOCK: 1 << 25,
    INLINE_LIST_ITEM: 1 << 26,
    INLINE_TABLE: 1 << 27,
    INLINE_FLEX: 1 << 28,
    INLINE_GRID: 1 << 29
};

const parseDisplayValue = display => {
    switch (display) {
        case 'block':
            return DISPLAY.BLOCK;
        case 'inline':
            return DISPLAY.INLINE;
        case 'run-in':
            return DISPLAY.RUN_IN;
        case 'flow':
            return DISPLAY.FLOW;
        case 'flow-root':
            return DISPLAY.FLOW_ROOT;
        case 'table':
            return DISPLAY.TABLE;
        case 'flex':
            return DISPLAY.FLEX;
        case 'grid':
            return DISPLAY.GRID;
        case 'ruby':
            return DISPLAY.RUBY;
        case 'subgrid':
            return DISPLAY.SUBGRID;
        case 'list-item':
            return DISPLAY.LIST_ITEM;
        case 'table-row-group':
            return DISPLAY.TABLE_ROW_GROUP;
        case 'table-header-group':
            return DISPLAY.TABLE_HEADER_GROUP;
        case 'table-footer-group':
            return DISPLAY.TABLE_FOOTER_GROUP;
        case 'table-row':
            return DISPLAY.TABLE_ROW;
        case 'table-cell':
            return DISPLAY.TABLE_CELL;
        case 'table-column-group':
            return DISPLAY.TABLE_COLUMN_GROUP;
        case 'table-column':
            return DISPLAY.TABLE_COLUMN;
        case 'table-caption':
            return DISPLAY.TABLE_CAPTION;
        case 'ruby-base':
            return DISPLAY.RUBY_BASE;
        case 'ruby-text':
            return DISPLAY.RUBY_TEXT;
        case 'ruby-base-container':
            return DISPLAY.RUBY_BASE_CONTAINER;
        case 'ruby-text-container':
            return DISPLAY.RUBY_TEXT_CONTAINER;
        case 'contents':
            return DISPLAY.CONTENTS;
        case 'inline-block':
            return DISPLAY.INLINE_BLOCK;
        case 'inline-list-item':
            return DISPLAY.INLINE_LIST_ITEM;
        case 'inline-table':
            return DISPLAY.INLINE_TABLE;
        case 'inline-flex':
            return DISPLAY.INLINE_FLEX;
        case 'inline-grid':
            return DISPLAY.INLINE_GRID;
    }

    return DISPLAY.NONE;
};

const setDisplayBit = (bit, display) => {
    return bit | parseDisplayValue(display);
};

const parseDisplay = display => {
    return display.split(' ').reduce(setDisplayBit, 0);
};

'use strict';

const FLOAT = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    INLINE_START: 3,
    INLINE_END: 4
};

const parseCSSFloat = float => {
    switch (float) {
        case 'left':
            return FLOAT.LEFT;
        case 'right':
            return FLOAT.RIGHT;
        case 'inline-start':
            return FLOAT.INLINE_START;
        case 'inline-end':
            return FLOAT.INLINE_END;
    }
    return FLOAT.NONE;
};

'use strict';

const parseFontWeight = weight => {
    switch (weight) {
        case 'normal':
            return 400;
        case 'bold':
            return 700;
    }

    const value = parseInt(weight, 10);
    return isNaN(value) ? 400 : value;
};

const parseFont = style => {
    const fontFamily = style.fontFamily;
    const fontSize = style.fontSize;
    const fontStyle = style.fontStyle;
    const fontVariant = style.fontVariant;
    const fontWeight = parseFontWeight(style.fontWeight);

    return {
        fontFamily,
        fontSize,
        fontStyle,
        fontVariant,
        fontWeight
    };
};

'use strict';

const parseLetterSpacing = letterSpacing => {
    if (letterSpacing === 'normal') {
        return 0;
    }
    const value = parseInt(letterSpacing, 10);
    return isNaN(value) ? 0 : value;
};

'use strict';

const OVERFLOW = {
    VISIBLE: 0,
    HIDDEN: 1,
    SCROLL: 2,
    AUTO: 3
};

const parseOverflow = overflow => {
    switch (overflow) {
        case 'hidden':
            return OVERFLOW.HIDDEN;
        case 'scroll':
            return OVERFLOW.SCROLL;
        case 'auto':
            return OVERFLOW.AUTO;
        case 'visible':
        default:
            return OVERFLOW.VISIBLE;
    }
};

'use strict';

const SIDES$2 = ['top', 'right', 'bottom', 'left'];

const parsePadding = style => {
    return SIDES$2.map(side => new Length(style.getPropertyValue(`padding-${side}`)));
};

'use strict';

const POSITION = {
    STATIC: 0,
    RELATIVE: 1,
    ABSOLUTE: 2,
    FIXED: 3,
    STICKY: 4
};

const parsePosition = position => {
    switch (position) {
        case 'relative':
            return POSITION.RELATIVE;
        case 'absolute':
            return POSITION.ABSOLUTE;
        case 'fixed':
            return POSITION.FIXED;
        case 'sticky':
            return POSITION.STICKY;
    }

    return POSITION.STATIC;
};

'use strict';

const NUMBER = /^([+-]|\d|\.)$/i;

const parseTextShadow = textShadow => {
    if (textShadow === 'none' || typeof textShadow !== 'string') {
        return null;
    }

    let currentValue = '';
    let isLength = false;
    const values = [];
    const shadows = [];
    let numParens = 0;
    let color = null;

    const appendValue = () => {
        if (currentValue.length) {
            if (isLength) {
                values.push(parseFloat(currentValue));
            } else {
                color = new Color(currentValue);
            }
        }
        isLength = false;
        currentValue = '';
    };

    const appendShadow = () => {
        if (values.length && color !== null) {
            shadows.push({
                color,
                offsetX: values[0] || 0,
                offsetY: values[1] || 0,
                blur: values[2] || 0
            });
        }
        values.splice(0, values.length);
        color = null;
    };

    for (let i = 0; i < textShadow.length; i++) {
        const c = textShadow[i];
        switch (c) {
            case '(':
                currentValue += c;
                numParens++;
                break;
            case ')':
                currentValue += c;
                numParens--;
                break;
            case ',':
                if (numParens === 0) {
                    appendValue();
                    appendShadow();
                } else {
                    currentValue += c;
                }
                break;
            case ' ':
                if (numParens === 0) {
                    appendValue();
                } else {
                    currentValue += c;
                }
                break;
            default:
                if (currentValue.length === 0 && NUMBER.test(c)) {
                    isLength = true;
                }
                currentValue += c;
        }
    }

    appendValue();
    appendShadow();

    if (shadows.length === 0) {
        return null;
    }

    return shadows;
};

'use strict';

const TEXT_TRANSFORM = {
    NONE: 0,
    LOWERCASE: 1,
    UPPERCASE: 2,
    CAPITALIZE: 3
};

const parseTextTransform = textTransform => {
    switch (textTransform) {
        case 'uppercase':
            return TEXT_TRANSFORM.UPPERCASE;
        case 'lowercase':
            return TEXT_TRANSFORM.LOWERCASE;
        case 'capitalize':
            return TEXT_TRANSFORM.CAPITALIZE;
    }

    return TEXT_TRANSFORM.NONE;
};

'use strict';

const toFloat = s => parseFloat(s.trim());

const MATRIX = /(matrix|matrix3d)\((.+)\)/;

const parseTransform = style => {
    const transform = parseTransformMatrix(style.transform || style.webkitTransform || style.mozTransform ||
    // $FlowFixMe
    style.msTransform ||
    // $FlowFixMe
    style.oTransform);
    if (transform === null) {
        return null;
    }

    return {
        transform,
        transformOrigin: parseTransformOrigin(style.transformOrigin || style.webkitTransformOrigin || style.mozTransformOrigin ||
        // $FlowFixMe
        style.msTransformOrigin ||
        // $FlowFixMe
        style.oTransformOrigin)
    };
};

// $FlowFixMe
const parseTransformOrigin = origin => {
    if (typeof origin !== 'string') {
        const v = new Length('0');
        return [v, v];
    }
    const values = origin.split(' ').map(Length.create);
    return [values[0], values[1]];
};

// $FlowFixMe
const parseTransformMatrix = transform => {
    if (transform === 'none' || typeof transform !== 'string') {
        return null;
    }

    const match = transform.match(MATRIX);
    if (match) {
        if (match[1] === 'matrix') {
            const matrix = match[2].split(',').map(toFloat);
            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
        } else {
            const matrix3d = match[2].split(',').map(toFloat);
            return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
        }
    }
    return null;
};

'use strict';

const VISIBILITY = {
    VISIBLE: 0,
    HIDDEN: 1,
    COLLAPSE: 2
};

const parseVisibility = visibility => {
    switch (visibility) {
        case 'hidden':
            return VISIBILITY.HIDDEN;
        case 'collapse':
            return VISIBILITY.COLLAPSE;
        case 'visible':
        default:
            return VISIBILITY.VISIBLE;
    }
};

'use strict';

const parseZIndex = zIndex => {
    const auto = zIndex === 'auto';
    return {
        auto,
        order: auto ? 0 : parseInt(zIndex, 10)
    };
};

'use strict';

/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
	const result = [];
	let length = array.length;
	while (length--) {
		result[length] = fn(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
	const parts = string.split('@');
	let result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		string = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	string = string.replace(regexSeparators, '.');
	const labels = string.split('.');
	const encoded = map(labels, fn).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			const extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
const ucs2encode = array => String.fromCodePoint(...array);

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
const decode = function(input) {
	// Don't use UCS-2.
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (let j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		let oldi = i;
		for (let w = 1, k = base; /* no condition */; k += base) {

			if (index >= inputLength) {
				error('invalid-input');
			}

			const digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base || digit > floor((maxInt - i) / w)) {
				error('overflow');
			}

			i += digit * w;
			const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

			if (digit < t) {
				break;
			}

			const baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error('overflow');
			}

			w *= baseMinusT;

		}

		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			error('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);

	}

	return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
const encode = function(input) {
	const output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	let inputLength = input.length;

	// Initialize the state.
	let n = initialN;
	let delta = 0;
	let bias = initialBias;

	// Handle the basic code points.
	for (const currentValue of input) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	}

	let basicLength = output.length;
	let handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		let m = maxInt;
		for (const currentValue of input) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		}

		// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
		// but guard against overflow.
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) {
				error('overflow');
			}
			if (currentValue == n) {
				// Represent delta as a generalized variable-length integer.
				let q = delta;
				for (let k = base; /* no condition */; k += base) {
					const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
				delta = 0;
				++handledCPCount;
			}
		}

		++delta;
		++n;

	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string)
			? decode(string.slice(4).toLowerCase())
			: string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string)
			? 'xn--' + encode(string)
			: string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
const punycode = {
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	'version': '2.1.0',
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};

class ForeignObjectRenderer {

    constructor(element) {
        this.element = element;
    }

    render(options) {
        this.options = options;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = Math.floor(options.bounds.width * options.scale);
        this.canvas.height = Math.floor(options.bounds.height * options.scale);
        this.canvas.style.width = `${options.bounds.width}px`;
        this.canvas.style.height = `${options.bounds.height}px`;
        this.ctx.scale(this.options.scale, this.options.scale);

        options.logger.log(`ForeignObject renderer initialized with scale ${this.options.scale}`);
        const svg = createForeignObjectSVG(options.bounds.width, options.bounds.height, this.element);

        return loadSerializedSVG(svg).then(img => {
            if (options.backgroundColor) {
                this.ctx.fillStyle = options.backgroundColor.toString();
                this.ctx.fillRect(0, 0, options.bounds.width, options.bounds.height);
            }
            this.ctx.drawImage(img, 0, 0);
            return this.canvas;
        });
    }
}

const createForeignObjectSVG = (width, height, node) => {
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    const foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);

    foreignObject.setAttributeNS(null, 'width', '100%');
    foreignObject.setAttributeNS(null, 'height', '100%');
    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);

    foreignObject.appendChild(node);

    return svg;
};

const loadSerializedSVG = svg => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
    });
};

'use strict';

const testRangeBounds = document => {
    const TEST_HEIGHT = 123;

    if (document.createRange) {
        const range = document.createRange();
        if (range.getBoundingClientRect) {
            const testElement = document.createElement('boundtest');
            testElement.style.height = `${TEST_HEIGHT}px`;
            testElement.style.display = 'block';
            document.body.appendChild(testElement);

            range.selectNode(testElement);
            const rangeBounds = range.getBoundingClientRect();
            const rangeHeight = Math.round(rangeBounds.height);
            document.body.removeChild(testElement);
            if (rangeHeight === TEST_HEIGHT) {
                return true;
            }
        }
    }

    return false;
};

// iOS 10.3 taints canvas with base64 images unless crossOrigin = 'anonymous'
const testBase64 = (document, src) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise(resolve => {
        // Single pixel base64 image renders fine on iOS 10.3???
        img.src = src;

        const onload = () => {
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch (e) {
                return resolve(false);
            }

            return resolve(true);
        };

        img.onload = onload;
        img.onerror = () => resolve(false);

        if (img.complete === true) {
            setTimeout(() => {
                onload();
            }, 500);
        }
    });
};

const testCORS = () => typeof new Image().crossOrigin !== 'undefined';

const testResponseType = () => typeof new XMLHttpRequest().responseType === 'string';

const testSVG = document => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>`;

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch (e) {
        return false;
    }
    return true;
};

const isGreenPixel = data => data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;

const testForeignObject = document => {
    const canvas = document.createElement('canvas');
    const size = 100;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    const greenImageSrc = canvas.toDataURL();
    img.src = greenImageSrc;
    const svg = createForeignObjectSVG(size, size, img);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, size, size);

    return loadSerializedSVG(svg).then(img => {
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, size, size).data;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, size, size);

        const node = document.createElement('div');
        node.style.backgroundImage = `url(${greenImageSrc})`;
        node.style.height = `${size}px`;
        // Firefox 55 does not render inline <img /> tags
        return isGreenPixel(data) ? loadSerializedSVG(createForeignObjectSVG(size, size, node)) : Promise.reject(false);
    }).then(img => {
        ctx.drawImage(img, 0, 0);
        // Edge does not render background-images
        return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
    }).catch(e => false);
};

const FEATURES = {
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_RANGE_BOUNDS() {
        'use strict';

        const value = testRangeBounds(document);
        Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', { value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_SVG_DRAWING() {
        'use strict';

        const value = testSVG(document);
        Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', { value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_BASE64_DRAWING() {
        'use strict';

        return src => {
            const value = testBase64(document, src);
            Object.defineProperty(FEATURES, 'SUPPORT_BASE64_DRAWING', { value: () => value });
            return value;
        };
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_FOREIGNOBJECT_DRAWING() {
        'use strict';

        const value = testForeignObject(document);
        Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', { value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_CORS_IMAGES() {
        'use strict';

        const value = testCORS();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', { value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_RESPONSE_TYPE() {
        'use strict';

        const value = testResponseType();
        Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', { value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_CORS_XHR() {
        'use strict';

        const value = 'withCredentials' in new XMLHttpRequest();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', { value });
        return value;
    }
};

'use strict';

var ucs2 = punycode.ucs2;

const UNICODE = /[^\u0000-\u00ff]/;

const hasUnicodeCharacters = text => UNICODE.test(text);

const encodeCodePoint = codePoint => ucs2.encode([codePoint]);

class TextBounds {

    constructor(text, bounds) {
        this.text = text;
        this.bounds = bounds;
    }
}

const parseTextBounds = (value, parent, node) => {
    const codePoints = ucs2.decode(value);
    const letterRendering = parent.style.letterSpacing !== 0 || hasUnicodeCharacters(value);
    const textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
    const length = textList.length;
    const textBounds = [];
    let offset = 0;
    for (let i = 0; i < length; i++) {
        let text = textList[i];
        if (parent.style.textDecoration !== TEXT_DECORATION.NONE || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
            } else {
                const replacementNode = node.splitText(text.length);
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

const getWrapperBounds = node => {
    const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    wrapper.appendChild(node.cloneNode(true));
    const parentNode = node.parentNode;
    if (parentNode) {
        parentNode.replaceChild(wrapper, node);
        const bounds = parseBounds(wrapper);
        if (wrapper.firstChild) {
            parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
    }
    return new Bounds(0, 0, 0, 0);
};

const getRangeBounds = (node, offset, length) => {
    const range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect());
};

const splitWords = codePoints => {
    const words = [];
    let i = 0;
    let onWordBoundary = false;
    let word;
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

const isWordBoundary = characterCode => {
    return [32, // <space>
        13, // \r
        10, // \n
        9, // \t
        45 // -
    ].indexOf(characterCode) !== -1;
};

'use strict';

class TextContainer {

    constructor(text, parent, bounds) {
        this.text = text;
        this.parent = parent;
        this.bounds = bounds;
    }

    static fromTextNode(node, parent) {
        const text = transform(node.data, parent.style.textTransform);
        return new TextContainer(text, parent, parseTextBounds(text, parent, node));
    }
}

const CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;

const transform = (text, transform) => {
    switch (transform) {
        case TEXT_TRANSFORM.LOWERCASE:
            return text.toLowerCase();
        case TEXT_TRANSFORM.CAPITALIZE:
            return text.replace(CAPITALIZE, capitalize);
        case TEXT_TRANSFORM.UPPERCASE:
            return text.toUpperCase();
        default:
            return text;
    }
};

function capitalize(m, p1, p2) {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }

    return m;
}

'use strict';

class Circle {

    constructor(x, y, radius) {
        this.type = PATH.CIRCLE;
        this.x = x;
        this.y = y;
        this.radius = radius;
        if (__DEV__) {
            if (isNaN(x)) {
                console.error(`Invalid x value given for Circle`);
            }
            if (isNaN(y)) {
                console.error(`Invalid y value given for Circle`);
            }
            if (isNaN(radius)) {
                console.error(`Invalid radius value given for Circle`);
            }
        }
    }
}

'use strict';

const INPUT_COLOR = new Color([42, 42, 42]);
const INPUT_BORDER_COLOR = new Color([165, 165, 165]);
const INPUT_BACKGROUND_COLOR = new Color([222, 222, 222]);
const INPUT_BORDER = {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    borderStyle: BORDER_STYLE.SOLID
};
const INPUT_BORDERS = [INPUT_BORDER, INPUT_BORDER, INPUT_BORDER, INPUT_BORDER];
const INPUT_BACKGROUND = {
    backgroundColor: INPUT_BACKGROUND_COLOR,
    backgroundImage: [],
    backgroundClip: BACKGROUND_CLIP.PADDING_BOX,
    backgroundOrigin: BACKGROUND_ORIGIN.PADDING_BOX
};

const RADIO_BORDER_RADIUS = new Length('50%');
const RADIO_BORDER_RADIUS_TUPLE = [RADIO_BORDER_RADIUS, RADIO_BORDER_RADIUS];
const INPUT_RADIO_BORDER_RADIUS = [RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE];

const CHECKBOX_BORDER_RADIUS = new Length('3px');
const CHECKBOX_BORDER_RADIUS_TUPLE = [CHECKBOX_BORDER_RADIUS, CHECKBOX_BORDER_RADIUS];
const INPUT_CHECKBOX_BORDER_RADIUS = [CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE];

const getInputBorderRadius = node => {
    return node.type === 'radio' ? INPUT_RADIO_BORDER_RADIUS : INPUT_CHECKBOX_BORDER_RADIUS;
};

const inlineInputElement = (node, container) => {
    if (node.type === 'radio' || node.type === 'checkbox') {
        if (node.checked) {
            const size = Math.min(container.bounds.width, container.bounds.height);
            container.childNodes.push(node.type === 'checkbox' ? [new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79), new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549), new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071), new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649), new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23), new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085), new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)] : new Circle(container.bounds.left + size / 4, container.bounds.top + size / 4, size / 4));
        }
    } else {
        inlineFormElement(getInputValue(node), node, container, false);
    }
};

const inlineTextAreaElement = (node, container) => {
    inlineFormElement(node.value, node, container, true);
};

const inlineSelectElement = (node, container) => {
    const option = node.options[node.selectedIndex || 0];
    inlineFormElement(option ? option.text || '' : '', node, container, false);
};

const reformatInputBounds = bounds => {
    if (bounds.width > bounds.height) {
        bounds.left += (bounds.width - bounds.height) / 2;
        bounds.width = bounds.height;
    } else if (bounds.width < bounds.height) {
        bounds.top += (bounds.height - bounds.width) / 2;
        bounds.height = bounds.width;
    }
    return bounds;
};

const inlineFormElement = (value, node, container, allowLinebreak) => {
    const body = node.ownerDocument.body;
    if (value.length > 0 && body) {
        const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
        copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node, null), wrapper);
        wrapper.style.position = 'fixed';
        wrapper.style.left = `${container.bounds.left}px`;
        wrapper.style.top = `${container.bounds.top}px`;
        if (!allowLinebreak) {
            wrapper.style.whiteSpace = 'nowrap';
        }
        const text = node.ownerDocument.createTextNode(value);
        wrapper.appendChild(text);
        body.appendChild(wrapper);
        container.childNodes.push(TextContainer.fromTextNode(text, container));
        body.removeChild(wrapper);
    }
};

const getInputValue = node => {
    const value = node.type === 'password' ? new Array(node.value.length + 1).join('\u2022') : node.value;

    return value.length === 0 ? node.placeholder || '' : value;
};

'use strict';

const INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

class NodeContainer {

    constructor(node, parent, imageLoader, index) {
        this.parent = parent;
        this.index = index;
        this.childNodes = [];
        const defaultView = node.ownerDocument.defaultView;
        const style = defaultView.getComputedStyle(node, null);
        const display = parseDisplay(style.display);

        const IS_INPUT = node.type === 'radio' || node.type === 'checkbox';

        const position = parsePosition(style.position);

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
            node.addEventListener('load', () => {
                this.bounds = parseBounds(node);
                this.curvedBounds = parseBoundCurves(this.bounds, this.style.border, this.style.borderRadius);
            });
        }
        this.image = getImage(node, imageLoader);
        this.bounds = IS_INPUT ? reformatInputBounds(parseBounds(node)) : parseBounds(node);
        this.curvedBounds = parseBoundCurves(this.bounds, this.style.border, this.style.borderRadius);

        if (__DEV__) {
            this.name = `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}${node.className.toString().split(' ').map(s => s.length ? `.${s}` : '').join('')}`;
        }
    }
    getClipPaths() {
        const parentClips = this.parent ? this.parent.getClipPaths() : [];
        const isClipped = this.style.overflow === OVERFLOW.HIDDEN || this.style.overflow === OVERFLOW.SCROLL;

        return isClipped ? parentClips.concat([calculatePaddingBoxPath(this.curvedBounds)]) : parentClips;
    }
    isInFlow() {
        return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned();
    }
    isVisible() {
        return !contains(this.style.display, DISPLAY.NONE) && this.style.opacity > 0 && this.style.visibility === VISIBILITY.VISIBLE;
    }
    isAbsolutelyPositioned() {
        return this.style.position !== POSITION.STATIC && this.style.position !== POSITION.RELATIVE;
    }
    isPositioned() {
        return this.style.position !== POSITION.STATIC;
    }
    isFloating() {
        return this.style.float !== FLOAT.NONE;
    }
    isRootElement() {
        return this.parent === null;
    }
    isTransformed() {
        return this.style.transform !== null;
    }
    isPositionedWithZIndex() {
        return this.isPositioned() && !this.style.zIndex.auto;
    }
    isInlineLevel() {
        return contains(this.style.display, DISPLAY.INLINE) || contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_FLEX) || contains(this.style.display, DISPLAY.INLINE_GRID) || contains(this.style.display, DISPLAY.INLINE_LIST_ITEM) || contains(this.style.display, DISPLAY.INLINE_TABLE);
    }
    isInlineBlockOrInlineTable() {
        return contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_TABLE);
    }
}

const getImage = (node, imageLoader) => {
    if (node instanceof node.ownerDocument.defaultView.SVGSVGElement || node instanceof SVGSVGElement) {
        const s = new XMLSerializer();
        return imageLoader.loadImage(`data:image/svg+xml,${encodeURIComponent(s.serializeToString(node))}`);
    }
    switch (node.tagName) {
        case 'IMG':
            // $FlowFixMe
            return imageLoader.loadImage(node.currentSrc || node.src);
        case 'CANVAS':
            // $FlowFixMe
            return imageLoader.loadCanvas(node);
        case 'DIV':
            const iframeKey = node.getAttribute('data-html2canvas-internal-iframe-key');
            if (iframeKey) {
                console.log('ok');
                return iframeKey;
            }
            break;
    }

    return null;
};

'use strict';

class StackingContext {

    constructor(container, parent, treatAsRealStackingContext) {
        this.container = container;
        this.parent = parent;
        this.contexts = [];
        this.children = [];
        this.treatAsRealStackingContext = treatAsRealStackingContext;
    }

    getOpacity() {
        return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
    }

    getRealParentStackingContext() {
        return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
    }
}

'use strict';

const NodeParser = (node, imageLoader, logger) => {
    if (__DEV__) {
        logger.log(`Starting node parsing`);
    }

    let index = 0;

    const container = new NodeContainer(node, null, imageLoader, index++);
    const stack = new StackingContext(container, null, true);

    parseNodeTree(node, container, stack, imageLoader, index);

    if (__DEV__) {
        logger.log(`Finished parsing node tree`);
    }

    return stack;
};

const IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];

const parseNodeTree = (node, parent, stack, imageLoader, index) => {
    if (__DEV__ && index > 50000) {
        throw new Error(`Recursion error while parsing node tree`);
    }

    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;
        const defaultView = childNode.ownerDocument.defaultView;
        if (childNode instanceof defaultView.Text || childNode instanceof Text) {
            if (childNode.data.trim().length > 0) {
                parent.childNodes.push(TextContainer.fromTextNode(childNode, parent));
            }
        } else if (childNode instanceof defaultView.HTMLElement || childNode instanceof HTMLElement) {
            if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
                const container = new NodeContainer(childNode, parent, imageLoader, index++);
                if (container.isVisible()) {
                    if (childNode.tagName === 'INPUT') {
                        // $FlowFixMe
                        inlineInputElement(childNode, container);
                    } else if (childNode.tagName === 'TEXTAREA') {
                        // $FlowFixMe
                        inlineTextAreaElement(childNode, container);
                    } else if (childNode.tagName === 'SELECT') {
                        // $FlowFixMe
                        inlineSelectElement(childNode, container);
                    }

                    const SHOULD_TRAVERSE_CHILDREN = childNode.tagName !== 'TEXTAREA';
                    const treatAsRealStackingContext = createsRealStackingContext(container, childNode);
                    if (treatAsRealStackingContext || createsStackingContext(container)) {
                        // for treatAsRealStackingContext:false, any positioned descendants and descendants
                        // which actually create a new stacking context should be considered part of the parent stacking context
                        const parentStack = treatAsRealStackingContext || container.isPositioned() ? stack.getRealParentStackingContext() : stack;
                        const childStack = new StackingContext(container, parentStack, treatAsRealStackingContext);
                        parentStack.contexts.push(childStack);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, childStack, imageLoader, index);
                        }
                    } else {
                        stack.children.push(container);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, stack, imageLoader, index);
                        }
                    }
                }
            }
        } else if (childNode instanceof defaultView.SVGSVGElement || childNode instanceof SVGSVGElement) {
            const container = new NodeContainer(childNode, parent, imageLoader, index++);
            const treatAsRealStackingContext = createsRealStackingContext(container, childNode);
            if (treatAsRealStackingContext || createsStackingContext(container)) {
                // for treatAsRealStackingContext:false, any positioned descendants and descendants
                // which actually create a new stacking context should be considered part of the parent stacking context
                const parentStack = treatAsRealStackingContext || container.isPositioned() ? stack.getRealParentStackingContext() : stack;
                const childStack = new StackingContext(container, parentStack, treatAsRealStackingContext);
                parentStack.contexts.push(childStack);
            } else {
                stack.children.push(container);
            }
        }
    }
};

const createsRealStackingContext = (container, node) => {
    return container.isRootElement() || container.isPositionedWithZIndex() || container.style.opacity < 1 || container.isTransformed() || isBodyWithTransparentRoot(container, node);
};

const createsStackingContext = container => {
    return container.isPositioned() || container.isFloating();
};

const isBodyWithTransparentRoot = (container, node) => {
    return node.nodeName === 'BODY' && container.parent instanceof NodeContainer && container.parent.style.background.backgroundColor.isTransparent();
};

'use strict';

const SAMPLE_TEXT = 'Hidden Text';
class FontMetrics {

    constructor(document) {
        this._data = {};
        this._document = document;
    }
    _parseMetrics(font) {
        const container = this._document.createElement('div');
        const img = this._document.createElement('img');
        const span = this._document.createElement('span');

        const body = this._document.body;
        if (!body) {
            throw new Error(__DEV__ ? 'No document found for font metrics' : '');
        }

        container.style.visibility = 'hidden';
        container.style.fontFamily = font.fontFamily;
        container.style.fontSize = font.fontSize;
        container.style.margin = '0';
        container.style.padding = '0';

        body.appendChild(container);

        img.src = SMALL_IMAGE;
        img.width = 1;
        img.height = 1;

        img.style.margin = '0';
        img.style.padding = '0';
        img.style.verticalAlign = 'baseline';

        span.style.fontFamily = font.fontFamily;
        span.style.fontSize = font.fontSize;
        span.style.margin = '0';
        span.style.padding = '0';

        span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
        container.appendChild(span);
        container.appendChild(img);
        const baseline = img.offsetTop - span.offsetTop + 2;

        container.removeChild(span);
        container.appendChild(this._document.createTextNode(SAMPLE_TEXT));

        container.style.lineHeight = 'normal';
        img.style.verticalAlign = 'super';

        const middle = img.offsetTop - container.offsetTop + 2;

        body.removeChild(container);

        return { baseline, middle };
    }
    getMetrics(font) {
        if (this._data[`${font.fontFamily} ${font.fontSize}`] === undefined) {
            this._data[`${font.fontFamily} ${font.fontSize}`] = this._parseMetrics(font);
        }
        return this._data[`${font.fontFamily} ${font.fontSize}`];
    }
}

'use strict';

const ANGLE = /([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;

const parseAngle = angle => {
    const match = angle.match(ANGLE);

    if (match) {
        const value = parseFloat(match[1]);
        switch (match[2].toLowerCase()) {
            case 'deg':
                return Math.PI * value / 180;
            case 'grad':
                return Math.PI / 200 * value;
            case 'rad':
                return value;
            case 'turn':
                return Math.PI * 2 * value;
        }
    }

    return null;
};

'use strict';

const SIDE_OR_CORNER = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i;
const PERCENTAGE_ANGLES = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i;
const ENDS_WITH_LENGTH = /(px)|%|( 0)$/i;
const FROM_TO = /^(from|to)\((.+)\)$/i;

const parseGradient = ({ args, method, prefix }, bounds) => {
    if (method === 'linear-gradient') {
        return parseLinearGradient(args, bounds);
    } else if (method === 'gradient' && args[0] === 'linear') {
        // TODO handle correct angle
        return parseLinearGradient(['to bottom'].concat(args.slice(3).map(color => color.match(FROM_TO)).filter(v => v !== null)
        // $FlowFixMe
        .map(v => v[2])), bounds);
    }
};

const parseLinearGradient = (args, bounds) => {
    const angle = parseAngle(args[0]);
    const HAS_SIDE_OR_CORNER = SIDE_OR_CORNER.test(args[0]);
    const HAS_DIRECTION = HAS_SIDE_OR_CORNER || angle !== null || PERCENTAGE_ANGLES.test(args[0]);
    const direction = HAS_DIRECTION ? angle !== null ? calculateGradientDirection(angle, bounds) : HAS_SIDE_OR_CORNER ? parseSideOrCorner(args[0], bounds) : parsePercentageAngle(args[0], bounds) : calculateGradientDirection(Math.PI, bounds);
    const colorStops = [];
    const firstColorStopIndex = HAS_DIRECTION ? 1 : 0;

    for (let i = firstColorStopIndex; i < args.length; i++) {
        const value = args[i];
        const HAS_LENGTH = ENDS_WITH_LENGTH.test(value);
        const lastSpaceIndex = value.lastIndexOf(' ');
        const color = new Color(HAS_LENGTH ? value.substring(0, lastSpaceIndex) : value);
        const stop = HAS_LENGTH ? new Length(value.substring(lastSpaceIndex + 1)) : i === firstColorStopIndex ? new Length('0%') : i === args.length - 1 ? new Length('100%') : null;
        colorStops.push({ color, stop });
    }

    // TODO: Fix some inaccuracy with color stops with px values
    const lineLength = Math.min(Math.sqrt(Math.pow(Math.abs(direction.x0) + Math.abs(direction.x1), 2) + Math.pow(Math.abs(direction.y0) + Math.abs(direction.y1), 2)), bounds.width * 2, bounds.height * 2);

    const absoluteValuedColorStops = colorStops.map(({ color, stop }) => {
        return {
            color,
            // $FlowFixMe
            stop: stop ? stop.getAbsoluteValue(lineLength) / lineLength : null
        };
    });

    let previousColorStop = absoluteValuedColorStops[0].stop;
    for (let i = 0; i < absoluteValuedColorStops.length; i++) {
        if (previousColorStop !== null) {
            const stop = absoluteValuedColorStops[i].stop;
            if (stop === null) {
                let n = i;
                while (absoluteValuedColorStops[n].stop === null) {
                    n++;
                }
                const steps = n - i + 1;
                const nextColorStep = absoluteValuedColorStops[n].stop;
                const stepSize = (nextColorStep - previousColorStop) / steps;
                for (; i < n; i++) {
                    previousColorStop = absoluteValuedColorStops[i].stop = previousColorStop + stepSize;
                }
            } else {
                previousColorStop = stop;
            }
        }
    }

    return {
        direction,
        colorStops: absoluteValuedColorStops
    };
};

const calculateGradientDirection = (radian, bounds) => {
    const width = bounds.width;
    const height = bounds.height;
    const HALF_WIDTH = width * 0.5;
    const HALF_HEIGHT = height * 0.5;
    const lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    const HALF_LINE_LENGTH = lineLength / 2;

    const x0 = HALF_WIDTH + Math.sin(radian) * HALF_LINE_LENGTH;
    const y0 = HALF_HEIGHT - Math.cos(radian) * HALF_LINE_LENGTH;
    const x1 = width - x0;
    const y1 = height - y0;

    return { x0, x1, y0, y1 };
};

const parseTopRight = bounds => Math.acos(bounds.width / 2 / (Math.sqrt(Math.pow(bounds.width, 2) + Math.pow(bounds.height, 2)) / 2));

const parseSideOrCorner = (side, bounds) => {
    switch (side) {
        case 'bottom':
        case 'to top':
            return calculateGradientDirection(0, bounds);
        case 'left':
        case 'to right':
            return calculateGradientDirection(Math.PI / 2, bounds);
        case 'right':
        case 'to left':
            return calculateGradientDirection(3 * Math.PI / 2, bounds);
        case 'top right':
        case 'right top':
        case 'to bottom left':
        case 'to left bottom':
            return calculateGradientDirection(Math.PI + parseTopRight(bounds), bounds);
        case 'top left':
        case 'left top':
        case 'to bottom right':
        case 'to right bottom':
            return calculateGradientDirection(Math.PI - parseTopRight(bounds), bounds);
        case 'bottom left':
        case 'left bottom':
        case 'to top right':
        case 'to right top':
            return calculateGradientDirection(parseTopRight(bounds), bounds);
        case 'bottom right':
        case 'right bottom':
        case 'to top left':
        case 'to left top':
            return calculateGradientDirection(2 * Math.PI - parseTopRight(bounds), bounds);
        case 'top':
        case 'to bottom':
        default:
            return calculateGradientDirection(Math.PI, bounds);
    }
};

const parsePercentageAngle = (angle, bounds) => {
    const [left, top] = angle.split(' ').map(parseFloat);
    const ratio = left / 100 * bounds.width / (top / 100 * bounds.height);

    return calculateGradientDirection(Math.atan(isNaN(ratio) ? 1 : ratio) + Math.PI / 2, bounds);
};

'use strict';

class Renderer {

    constructor(target, options) {
        this.target = target;
        this.options = options;
        target.render(options);
    }

    renderNode(container) {
        if (container.isVisible()) {
            this.renderNodeBackgroundAndBorders(container);
            this.renderNodeContent(container);
        }
    }

    renderNodeContent(container) {
        const callback = () => {
            if (container.childNodes.length) {
                container.childNodes.forEach(child => {
                    if (child instanceof TextContainer) {
                        const style = child.parent.style;
                        this.target.renderTextNode(child.bounds, style.color, style.font, style.textDecoration, style.textShadow);
                    } else {
                        this.target.drawShape(child, container.style.color);
                    }
                });
            }

            if (container.image) {
                const image = this.options.imageStore.get(container.image);
                if (image) {
                    const contentBox = calculateContentBox(container.bounds, container.style.padding, container.style.border);
                    const width = typeof image.width === 'number' && image.width > 0 ? image.width : contentBox.width;
                    const height = typeof image.height === 'number' && image.height > 0 ? image.height : contentBox.height;
                    if (width > 0 && height > 0) {
                        this.target.clip([calculatePaddingBoxPath(container.curvedBounds)], () => {
                            this.target.drawImage(image, new Bounds(0, 0, width, height), contentBox);
                        });
                    }
                }
            }
        };
        const paths = container.getClipPaths();
        if (paths.length) {
            this.target.clip(paths, callback);
        } else {
            callback();
        }
    }

    renderNodeBackgroundAndBorders(container) {
        const HAS_BACKGROUND = !container.style.background.backgroundColor.isTransparent() || container.style.background.backgroundImage.length;

        const renderableBorders = container.style.border.filter(border => border.borderStyle !== BORDER_STYLE.NONE && !border.borderColor.isTransparent());

        const callback = () => {
            const backgroundPaintingArea = calculateBackgroungPaintingArea(container.curvedBounds, container.style.background.backgroundClip);

            if (HAS_BACKGROUND) {
                this.target.clip([backgroundPaintingArea], () => {
                    if (!container.style.background.backgroundColor.isTransparent()) {
                        this.target.fill(container.style.background.backgroundColor);
                    }

                    this.renderBackgroundImage(container);
                });
            }

            renderableBorders.forEach((border, side) => {
                this.renderBorder(border, side, container.curvedBounds);
            });
        };

        if (HAS_BACKGROUND || renderableBorders.length) {
            const paths = container.parent ? container.parent.getClipPaths() : [];
            if (paths.length) {
                this.target.clip(paths, callback);
            } else {
                callback();
            }
        }
    }

    renderBackgroundImage(container) {
        container.style.background.backgroundImage.slice(0).reverse().forEach(backgroundImage => {
            if (backgroundImage.source.method === 'url' && backgroundImage.source.args.length) {
                this.renderBackgroundRepeat(container, backgroundImage);
            } else {
                const gradient = parseGradient(backgroundImage.source, container.bounds);
                if (gradient) {
                    const bounds = container.bounds;
                    this.target.renderLinearGradient(bounds, gradient);
                }
            }
        });
    }

    renderBackgroundRepeat(container, background) {
        const image = this.options.imageStore.get(background.source.args[0]);
        if (image) {
            const bounds = container.bounds;
            const paddingBox = calculatePaddingBox(bounds, container.style.border);
            const backgroundImageSize = calculateBackgroundSize(background, image, bounds);

            // TODO support CONTENT_BOX
            const backgroundPositioningArea = container.style.background.backgroundOrigin === BACKGROUND_ORIGIN.BORDER_BOX ? bounds : paddingBox;

            const position = calculateBackgroundPosition(background.position, backgroundImageSize, backgroundPositioningArea);
            const path = calculateBackgroundRepeatPath(background, position, backgroundImageSize, backgroundPositioningArea, bounds);

            const offsetX = Math.round(paddingBox.left + position.x);
            const offsetY = Math.round(paddingBox.top + position.y);
            this.target.renderRepeat(path, image, backgroundImageSize, offsetX, offsetY);
        }
    }

    renderBorder(border, side, curvePoints) {
        this.target.drawShape(parsePathForBorder(curvePoints, side), border.borderColor);
    }

    renderStack(stack) {
        if (stack.container.isVisible()) {
            const opacity = stack.getOpacity();
            if (opacity !== this._opacity) {
                this.target.setOpacity(stack.getOpacity());
                this._opacity = opacity;
            }

            const transform = stack.container.style.transform;
            if (transform !== null) {
                this.target.transform(stack.container.bounds.left + transform.transformOrigin[0].value, stack.container.bounds.top + transform.transformOrigin[1].value, transform.transform, () => this.renderStackContent(stack));
            } else {
                this.renderStackContent(stack);
            }
        }
    }

    renderStackContent(stack) {
        const [negativeZIndex, zeroOrAutoZIndexOrTransformedOrOpacity, positiveZIndex, nonPositionedFloats, nonPositionedInlineLevel] = splitStackingContexts(stack);
        const [inlineLevel, nonInlineLevel] = splitDescendants(stack);

        // https://www.w3.org/TR/css-position-3/#painting-order
        // 1. the background and borders of the element forming the stacking context.
        this.renderNodeBackgroundAndBorders(stack.container);
        // 2. the child stacking contexts with negative stack levels (most negative first).
        negativeZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
        // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
        this.renderNodeContent(stack.container);
        nonInlineLevel.forEach(this.renderNode, this);
        // 4. All non-positioned floating descendants, in tree order. For each one of these,
        // treat the element as if it created a new stacking context, but any positioned descendants and descendants
        // which actually create a new stacking context should be considered part of the parent stacking context,
        // not this new one.
        nonPositionedFloats.forEach(this.renderStack, this);
        // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
        nonPositionedInlineLevel.forEach(this.renderStack, this);
        inlineLevel.forEach(this.renderNode, this);
        // 6. All positioned, opacity or transform descendants, in tree order that fall into the following categories:
        //  All positioned descendants with 'z-index: auto' or 'z-index: 0', in tree order.
        //  For those with 'z-index: auto', treat the element as if it created a new stacking context,
        //  but any positioned descendants and descendants which actually create a new stacking context should be
        //  considered part of the parent stacking context, not this new one. For those with 'z-index: 0',
        //  treat the stacking context generated atomically.
        //
        //  All opacity descendants with opacity less than 1
        //
        //  All transform descendants with transform other than none
        zeroOrAutoZIndexOrTransformedOrOpacity.forEach(this.renderStack, this);
        // 7. Stacking contexts formed by positioned descendants with z-indices greater than or equal to 1 in z-index
        // order (smallest first) then tree order.
        positiveZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
    }

    render(stack) {
        if (this.options.backgroundColor) {
            this.target.rectangle(0, 0, this.options.width, this.options.height, this.options.backgroundColor);
        }
        this.renderStack(stack);
        const target = this.target.getTarget();
        if (__DEV__) {
            return target.then(output => {
                this.options.logger.log(`Render completed`);
                return output;
            });
        }
        return target;
    }
}

const splitDescendants = stack => {
    const inlineLevel = [];
    const nonInlineLevel = [];

    const length = stack.children.length;
    for (let i = 0; i < length; i++) {
        let child = stack.children[i];
        if (child.isInlineLevel()) {
            inlineLevel.push(child);
        } else {
            nonInlineLevel.push(child);
        }
    }
    return [inlineLevel, nonInlineLevel];
};

const splitStackingContexts = stack => {
    const negativeZIndex = [];
    const zeroOrAutoZIndexOrTransformedOrOpacity = [];
    const positiveZIndex = [];
    const nonPositionedFloats = [];
    const nonPositionedInlineLevel = [];
    const length = stack.contexts.length;
    for (let i = 0; i < length; i++) {
        let child = stack.contexts[i];
        if (child.container.isPositioned() || child.container.style.opacity < 1 || child.container.isTransformed()) {
            if (child.container.style.zIndex.order < 0) {
                negativeZIndex.push(child);
            } else if (child.container.style.zIndex.order > 0) {
                positiveZIndex.push(child);
            } else {
                zeroOrAutoZIndexOrTransformedOrOpacity.push(child);
            }
        } else {
            if (child.container.isFloating()) {
                nonPositionedFloats.push(child);
            } else {
                nonPositionedInlineLevel.push(child);
            }
        }
    }
    return [negativeZIndex, zeroOrAutoZIndexOrTransformedOrOpacity, positiveZIndex, nonPositionedFloats, nonPositionedInlineLevel];
};

const sortByZIndex = (a, b) => {
    if (a.container.style.zIndex.order > b.container.style.zIndex.order) {
        return 1;
    } else if (a.container.style.zIndex.order < b.container.style.zIndex.order) {
        return -1;
    }

    return a.container.index > b.container.index ? 1 : -1;
};

'use strict';

const Proxy = (src, options) => {
    if (!options.proxy) {
        return Promise.reject(__DEV__ ? 'No proxy defined' : null);
    }
    const proxy = options.proxy;

    return new Promise((resolve, reject) => {
        const responseType = FEATURES.SUPPORT_CORS_XHR && FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
        const xhr = FEATURES.SUPPORT_CORS_XHR ? new XMLHttpRequest() : new XDomainRequest();
        xhr.onload = () => {
            if (xhr instanceof XMLHttpRequest) {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        resolve(xhr.response);
                    } else {
                        const reader = new FileReader();
                        // $FlowFixMe
                        reader.addEventListener('load', () => resolve(reader.result), false);
                        // $FlowFixMe
                        reader.addEventListener('error', e => reject(e), false);
                        reader.readAsDataURL(xhr.response);
                    }
                } else {
                    reject(__DEV__ ? `Failed to proxy image ${src.substring(0, 256)} with status code ${xhr.status}` : '');
                }
            } else {
                resolve(xhr.responseText);
            }
        };

        xhr.onerror = reject;
        xhr.open('GET', `${proxy}?url=${encodeURIComponent(src)}&responseType=${responseType}`);

        if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
            xhr.responseType = responseType;
        }

        if (options.imageTimeout) {
            const timeout = options.imageTimeout;
            xhr.timeout = timeout;
            xhr.ontimeout = () => reject(__DEV__ ? `Timed out (${timeout}ms) proxying ${src.substring(0, 256)}` : '');
        }

        xhr.send();
    });
};

'use strict';

// $FlowFixMe
class ImageLoader {

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

class ImageStore {

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

'use strict';

class DocumentCloner {

    constructor(element, options, logger, copyInline, renderer) {
        this.referenceElement = element;
        this.scrolledElements = [];
        this.copyStyles = copyInline;
        this.inlineImages = copyInline;
        this.logger = logger;
        this.options = options;
        this.renderer = renderer;
        this.imageLoader = new ImageLoader(options, logger, window);
        // $FlowFixMe
        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
    }

    inlineAllImages(node) {
        if (this.inlineImages && node) {
            const style = node.style;
            Promise.all(parseBackgroundImage(style.backgroundImage).map(backgroundImage => {
                if (backgroundImage.method === 'url') {
                    return this.imageLoader.inlineImage(backgroundImage.args[0]).then(img => img ? `url("${img.src}")` : 'none').catch(e => {
                        if (__DEV__) {
                            this.logger.log(`Unable to load image`, e);
                        }
                    });
                }
                return Promise.resolve(`${backgroundImage.prefix}${backgroundImage.method}(${backgroundImage.args.join(',')})`);
            })).then(backgroundImages => {
                if (backgroundImages.length > 1) {
                    // TODO Multiple backgrounds somehow broken in Chrome
                    style.backgroundColor = '';
                }
                style.backgroundImage = backgroundImages.join(',');
            });

            if (node instanceof HTMLImageElement) {
                this.imageLoader.inlineImage(node.src).then(img => {
                    if (img && node instanceof HTMLImageElement && node.parentNode) {
                        const parentNode = node.parentNode;
                        const clonedChild = copyCSSStyles(node.style, img.cloneNode(false));
                        parentNode.replaceChild(clonedChild, node);
                    }
                }).catch(e => {
                    if (__DEV__) {
                        this.logger.log(`Unable to load image`, e);
                    }
                });
            }
        }
    }

    createElementClone(node) {
        if (this.copyStyles && node instanceof HTMLCanvasElement) {
            const img = node.ownerDocument.createElement('img');
            try {
                img.src = node.toDataURL();
                return img;
            } catch (e) {
                if (__DEV__) {
                    this.logger.log(`Unable to clone canvas contents, canvas is tainted`);
                }
            }
        }

        if (node instanceof HTMLIFrameElement) {
            const tempIframe = node.cloneNode(false);
            const iframeKey = generateIframeKey();
            tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

            this.imageLoader.cache[iframeKey] = getIframeDocumentElement(node, this.options).then(documentElement => {
                return this.renderer(documentElement, {
                    async: this.options.async,
                    allowTaint: this.options.allowTaint,
                    backgroundColor: '#ffffff',
                    canvas: null,
                    imageTimeout: this.options.imageTimeout,
                    proxy: this.options.proxy,
                    removeContainer: this.options.removeContainer,
                    scale: this.options.scale,
                    target: new CanvasRenderer(),
                    type: 'view',
                    windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
                    windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
                    offsetX: documentElement.ownerDocument.defaultView.pageXOffset,
                    offsetY: documentElement.ownerDocument.defaultView.pageYOffset
                }, this.logger.child(iframeKey));
            }).then(canvas => {
                const iframeCanvas = document.createElement('img');
                iframeCanvas.src = canvas.toDataURL();
                if (tempIframe.parentNode) {
                    tempIframe.parentNode.replaceChild(copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), iframeCanvas), tempIframe);
                }
                return canvas;
            });
            return tempIframe;
        }

        return node.cloneNode(false);
    }

    cloneNode(node) {
        const clone = node.nodeType === Node.TEXT_NODE ? document.createTextNode(node.nodeValue) : this.createElementClone(node);

        const window = node.ownerDocument.defaultView;

        if (this.referenceElement === node && clone instanceof window.HTMLElement) {
            this.clonedReferenceElement = clone;
        }

        if (clone instanceof window.HTMLBodyElement) {
            createPseudoHideStyles(clone);
        }

        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'SCRIPT') {
                if (!this.copyStyles || child.nodeName !== 'STYLE') {
                    clone.appendChild(this.cloneNode(child));
                }
            }
        }
        if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_BEFORE));
            this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_AFTER));
            if (this.copyStyles && !(node instanceof HTMLIFrameElement)) {
                copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), clone);
            }
            this.inlineAllImages(clone);
            if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                this.scrolledElements.push([node, node.scrollLeft, node.scrollTop]);
            }
            switch (node.nodeName) {
                case 'CANVAS':
                    if (!this.copyStyles) {
                        cloneCanvasContents(node, clone);
                    }
                    break;
                case 'TEXTAREA':
                case 'SELECT':
                    clone.value = node.value;
                    break;
            }
        }
        return clone;
    }
}

const restoreOwnerScroll = (ownerDocument, x, y) => {
    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
};

const cloneCanvasContents = (canvas, clonedCanvas) => {
    try {
        if (clonedCanvas) {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            clonedCanvas.getContext('2d').putImageData(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), 0, 0);
        }
    } catch (e) {}
};

const inlinePseudoElement = (node, clone, pseudoElt) => {
    const style = node.ownerDocument.defaultView.getComputedStyle(node, pseudoElt);
    if (!style || !style.content || style.content === 'none' || style.content === '-moz-alt-content' || style.display === 'none') {
        return;
    }

    const content = stripQuotes(style.content);
    const image = content.match(URL_REGEXP);
    const anonymousReplacedElement = clone.ownerDocument.createElement(image ? 'img' : 'html2canvaspseudoelement');
    if (image) {
        // $FlowFixMe
        anonymousReplacedElement.src = stripQuotes(image[1]);
    } else {
        anonymousReplacedElement.textContent = content;
    }

    copyCSSStyles(style, anonymousReplacedElement);

    anonymousReplacedElement.className = `${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE} ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    clone.className += pseudoElt === PSEUDO_BEFORE ? ` ${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}` : ` ${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;
    if (pseudoElt === PSEUDO_BEFORE) {
        clone.insertBefore(anonymousReplacedElement, clone.firstChild);
    } else {
        clone.appendChild(anonymousReplacedElement);
    }

    return anonymousReplacedElement;
};

const stripQuotes = content => {
    const first = content.substr(0, 1);
    return first === content.substr(content.length - 1) && first.match(/['"]/) ? content.substr(1, content.length - 2) : content;
};

const URL_REGEXP = /^url\((.+)\)$/i;
const PSEUDO_BEFORE = ':before';
const PSEUDO_AFTER = ':after';
const PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
const PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';

const PSEUDO_HIDE_ELEMENT_STYLE = `{
    content: "" !important;
    display: none !important;
}`;

const createPseudoHideStyles = body => {
    createStyles(body, `.${PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}${PSEUDO_BEFORE}${PSEUDO_HIDE_ELEMENT_STYLE}
         .${PSEUDO_HIDE_ELEMENT_CLASS_AFTER}${PSEUDO_AFTER}${PSEUDO_HIDE_ELEMENT_STYLE}`);
};

const createStyles = (body, styles) => {
    const style = body.ownerDocument.createElement('style');
    style.innerHTML = styles;
    body.appendChild(style);
};

const initNode = ([element, x, y]) => {
    element.scrollLeft = x;
    element.scrollTop = y;
};

const generateIframeKey = () => Math.ceil(Date.now() + Math.random() * 10000000).toString(16);

const getIframeDocumentElement = (node, options) => {
    try {
        return Promise.resolve(node.contentWindow.document.documentElement);
    } catch (e) {
        return Promise.reject();
    }
};

const cloneWindow = (ownerDocument, bounds, referenceElement, options, logger, renderer) => {
    const cloner = new DocumentCloner(referenceElement, options, logger, false, renderer);
    const cloneIframeContainer = ownerDocument.createElement('iframe');

    cloneIframeContainer.className = 'html2canvas-container';
    cloneIframeContainer.style.visibility = 'hidden';
    cloneIframeContainer.style.position = 'fixed';
    cloneIframeContainer.style.left = '-10000px';
    cloneIframeContainer.style.top = '0px';
    cloneIframeContainer.style.border = '0';
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
    if (ownerDocument.body) {
        ownerDocument.body.appendChild(cloneIframeContainer);
    } else {
        return Promise.reject(__DEV__ ? `Body element not found in Document that is getting rendered` : '');
    }
    return new Promise((resolve, reject) => {
        const cloneWindow = cloneIframeContainer.contentWindow;
        const documentClone = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        cloneWindow.onload = cloneIframeContainer.onload = () => {
            const interval = setInterval(() => {
                if (documentClone.body.childNodes.length > 0) {
                    cloner.scrolledElements.forEach(initNode);
                    clearInterval(interval);
                    if (options.type === 'view') {
                        cloneWindow.scrollTo(bounds.left, bounds.top);
                        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== bounds.top || cloneWindow.scrollX !== bounds.left)) {
                            documentClone.documentElement.style.top = -bounds.top + 'px';
                            documentClone.documentElement.style.left = -bounds.left + 'px';
                            documentClone.documentElement.style.position = 'absolute';
                        }
                    }
                    if (cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement || cloner.clonedReferenceElement instanceof HTMLElement) {
                        resolve([cloneIframeContainer, cloner.clonedReferenceElement, cloner.imageLoader]);
                    } else {
                        reject(__DEV__ ? `Error finding the ${referenceElement.nodeName} in the cloned document` : '');
                    }
                }
            }, 50);
        };

        documentClone.open();
        documentClone.write('<!DOCTYPE html><html></html>');
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(referenceElement.ownerDocument, bounds.left, bounds.top);
        documentClone.replaceChild(documentClone.adoptNode(cloner.documentElement), documentClone.documentElement);
        documentClone.close();
    });
};

'use strict';

const renderElement = (element, options, logger) => {
    const ownerDocument = element.ownerDocument;

    const windowBounds = new Bounds(options.offsetX, options.offsetY, options.windowWidth, options.windowHeight);

    const bounds = options.type === 'view' ? windowBounds : parseDocumentSize(ownerDocument);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const documentBackgroundColor = ownerDocument.documentElement ? new Color(getComputedStyle(ownerDocument.documentElement).backgroundColor) : TRANSPARENT;
    const bodyBackgroundColor = ownerDocument.body ? new Color(getComputedStyle(ownerDocument.body).backgroundColor) : TRANSPARENT;

    const backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new Color(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new Color(options.backgroundColor) : null;

    // $FlowFixMe
    return FEATURES.SUPPORT_FOREIGNOBJECT_DRAWING.then(supportForeignObject => supportForeignObject ? (cloner => {
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

export { html2canvas };
