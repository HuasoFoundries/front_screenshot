var ForeignObjectRenderer = function () {
    function ForeignObjectRenderer(element) {
        babelHelpers.classCallCheck(this, ForeignObjectRenderer);

        this.element = element;
    }

    babelHelpers.createClass(ForeignObjectRenderer, [{
        key: 'render',
        value: function render(options) {
            var _this = this;

            this.options = options;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = Math.floor(options.bounds.width * options.scale);
            this.canvas.height = Math.floor(options.bounds.height * options.scale);
            this.canvas.style.width = options.bounds.width + 'px';
            this.canvas.style.height = options.bounds.height + 'px';
            this.ctx.scale(this.options.scale, this.options.scale);

            options.logger.log('ForeignObject renderer initialized with scale ' + this.options.scale);
            var svg = createForeignObjectSVG(options.bounds.width, options.bounds.height, this.element);

            return loadSerializedSVG(svg).then(function (img) {
                if (options.backgroundColor) {
                    _this.ctx.fillStyle = options.backgroundColor.toString();
                    _this.ctx.fillRect(0, 0, options.bounds.width, options.bounds.height);
                }
                _this.ctx.drawImage(img, 0, 0);
                return _this.canvas;
            });
        }
    }]);
    return ForeignObjectRenderer;
}();

export default ForeignObjectRenderer;


export var createForeignObjectSVG = function createForeignObjectSVG(width, height, node) {
    var xmlns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(xmlns, 'svg');
    var foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);

    foreignObject.setAttributeNS(null, 'width', '100%');
    foreignObject.setAttributeNS(null, 'height', '100%');
    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);

    foreignObject.appendChild(node);

    return svg;
};

export var loadSerializedSVG = function loadSerializedSVG(svg) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            return resolve(img);
        };
        img.onerror = reject;

        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    });
};