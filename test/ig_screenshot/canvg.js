(function (QUnit) {

	QUnit.module("canvg Methods");

	QUnit.test('screenShooter.canvg should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.canvg, 'function', 'screenShooter.canvg should be a valid method');
	});

	QUnit.test('screenShooter.svgToImg should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.svgToImg, 'function', 'screenShooter.svgToImg should be a valid method');
	});

	QUnit.test('screenShooter.svgToImg convert an SVG into an image with the right src', function (assert) {

		var done = assert.async();
		var expected =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAANElEQVQY0+WQsREAIAjEgovBZriZONm7Adqbu3SpYoWrCDqcDZMUqDWZGjzyZ2iLuA4PigPC3hv5j7Q5JgAAAABJRU5ErkJggg==';
		var the_image = screenShooter.svgToImg(jQuery('#svg_container1'), 0, function (the_image) {
			assert.equal(the_image.src, expected, 'generated image src attribute matches expected dataURL');
			done();
		});

	});

	QUnit.test('screenShooter.svgToCanvas should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.svgToCanvas, 'function', 'screenShooter.svgToCanvas should be a valid method');
	});

	QUnit.test('screenShooter.svgToCanvas should generate a canvas with the right contents', function (assert) {

		var done = assert.async();
		var expected =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAANElEQVQY0+WQsREAIAjEgovBZriZONm7Adqbu3SpYoWrCDqcDZMUqDWZGjzyZ2iLuA4PigPC3hv5j7Q5JgAAAABJRU5ErkJggg==';
		screenShooter.svgToCanvas(jQuery('#svg_container2'), function (the_canvas) {
			assert.equal(the_canvas.toDataURL("image/png", 0), expected, 'generated canvas has the right contents');

			done();
		});

	});

})(QUnit);
