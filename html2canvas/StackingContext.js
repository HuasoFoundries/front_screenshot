'use strict';

import NodeContainer from './NodeContainer';
import { POSITION } from './parsing/position';

var StackingContext = function () {
    function StackingContext(container, parent, treatAsRealStackingContext) {
        babelHelpers.classCallCheck(this, StackingContext);

        this.container = container;
        this.parent = parent;
        this.contexts = [];
        this.children = [];
        this.treatAsRealStackingContext = treatAsRealStackingContext;
    }

    babelHelpers.createClass(StackingContext, [{
        key: 'getOpacity',
        value: function getOpacity() {
            return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
        }
    }, {
        key: 'getRealParentStackingContext',
        value: function getRealParentStackingContext() {
            return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
        }
    }]);
    return StackingContext;
}();

export default StackingContext;