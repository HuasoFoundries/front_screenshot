'use strict';

import { PATH } from './Path';

export default class Vector {

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