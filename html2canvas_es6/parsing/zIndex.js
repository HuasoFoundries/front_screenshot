'use strict';

export const parseZIndex = zIndex => {
    const auto = zIndex === 'auto';
    return {
        auto,
        order: auto ? 0 : parseInt(zIndex, 10)
    };
};