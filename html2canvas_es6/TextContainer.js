'use strict';

import { TEXT_TRANSFORM } from './parsing/textTransform';
import { parseTextBounds } from './TextBounds';

export default class TextContainer {

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