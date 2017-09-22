'use strict';

import Length from '../Length';

const SIDES = ['top', 'right', 'bottom', 'left'];

export const parsePadding = style => {
    return SIDES.map(side => new Length(style.getPropertyValue(`padding-${side}`)));
};