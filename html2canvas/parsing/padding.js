'use strict';

import Length from '../Length';

var SIDES = ['top', 'right', 'bottom', 'left'];

export var parsePadding = function parsePadding(style) {
    return SIDES.map(function (side) {
        return new Length(style.getPropertyValue('padding-' + side));
    });
};