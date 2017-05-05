(function (QUnit) {

	QUnit.module("screenShooter Entities");

	QUnit.test('infoScreenShot should be of type function', function (assert) {
		assert.equal(typeof screenShooter.infoScreenShot, 'function', 'infoScreenShot should be if type function');
	});

	QUnit.test('screenShooter.html2canvas should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.html2canvas, 'function', 'screenShooter.html2canvas should be a valid method');
	});

	QUnit.test('screenShooter.canvg should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.canvg, 'function', 'screenShooter.canvg should be a valid method');
	});

	QUnit.test('screenShooter.hiddenClone should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.hiddenClone, 'function', 'screenShooter.hiddenClone should be a valid method');
	});

	QUnit.test('screenShooter.svgAImg should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.svgAImg, 'function', 'screenShooter.svgAImg should be a valid method');
	});

	QUnit.test('screenShooter.svgACanvas should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.svgACanvas, 'function', 'screenShooter.svgACanvas should be a valid method');
	});

})(QUnit);
