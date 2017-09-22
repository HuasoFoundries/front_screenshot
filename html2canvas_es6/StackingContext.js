'use strict';

import NodeContainer from './NodeContainer';
import { POSITION } from './parsing/position';

export default class StackingContext {

    constructor(container, parent, treatAsRealStackingContext) {
        this.container = container;
        this.parent = parent;
        this.contexts = [];
        this.children = [];
        this.treatAsRealStackingContext = treatAsRealStackingContext;
    }

    getOpacity() {
        return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
    }

    getRealParentStackingContext() {
        return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
    }
}