'use strict';

import { PATH } from './Path';

var Circle = function Circle(x, y, radius) {
    babelHelpers.classCallCheck(this, Circle);

    this.type = PATH.CIRCLE;
    this.x = x;
    this.y = y;
    this.radius = radius;
    if (__DEV__) {
        if (isNaN(x)) {
            console.error('Invalid x value given for Circle');
        }
        if (isNaN(y)) {
            console.error('Invalid y value given for Circle');
        }
        if (isNaN(radius)) {
            console.error('Invalid radius value given for Circle');
        }
    }
};

export default Circle;