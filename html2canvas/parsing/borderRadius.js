'use strict';

import Length from '../Length';

var SIDES = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

export var parseBorderRadius = function parseBorderRadius(style) {
    return SIDES.map(function (side) {
        var value = style.getPropertyValue('border-' + side + '-radius');

        var _value$split$map = value.split(' ').map(Length.create),
            _value$split$map2 = babelHelpers.slicedToArray(_value$split$map, 2),
            horizontal = _value$split$map2[0],
            vertical = _value$split$map2[1];

        return typeof vertical === 'undefined' ? [horizontal, horizontal] : [horizontal, vertical];
    });
};