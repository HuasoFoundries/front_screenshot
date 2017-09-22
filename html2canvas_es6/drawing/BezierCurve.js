'use strict';

import { PATH } from './Path';
import Vector from './Vector';

const lerp = (a, b, t) => {
    return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

export default class BezierCurve {

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