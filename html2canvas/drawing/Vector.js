'use strict';

import { PATH } from './Path';

var Vector = function Vector(x, y) {
    babelHelpers.classCallCheck(this, Vector);

    this.type = PATH.VECTOR;
    this.x = x;
    this.y = y;
    if (__DEV__) {
        if (isNaN(x)) {
            console.error('Invalid x value given for Vector');
        }
        if (isNaN(y)) {
            console.error('Invalid y value given for Vector');
        }
    }
};

export default Vector;