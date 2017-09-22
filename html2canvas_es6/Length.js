'use strict';

export const LENGTH_TYPE = {
    PX: 0,
    PERCENTAGE: 1
};

export default class Length {

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