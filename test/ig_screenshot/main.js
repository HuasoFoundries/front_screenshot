(function (QUnit) {

	QUnit.module("screenShooter general methods");

	QUnit.test('screenShooter.infoScreenShot should be of type function', function (assert) {
		assert.equal(typeof screenShooter.infoScreenShot, 'function', 'infoScreenShot should be if type function');
	});

	QUnit.test('screenShooter.infoScreenShot should render a container as a canvas with the expected contents', function (assert) {

		var done = assert.async();

		screenShooter.infoScreenShot(jQuery('#text_container'))
			.then(function (the_canvas) {

				var expected =
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAYCAYAAAD+vg1LAAAAAXNSR0IArs4c6QAAADFJREFUSEtj'; // eslint-disable-line max-len

				assert.equal(the_canvas.toDataURL("image/png", 0).substring(0, 98), expected.substring(0, 98), 'captured dataurl matches expected');
				done();

			});
	});

	QUnit.test('screenShooter.hiddenClone should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.hiddenClone, 'function', 'screenShooter.hiddenClone should be a valid method');
	});

}(QUnit));
