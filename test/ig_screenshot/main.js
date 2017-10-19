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
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAnUlEQVQoz7XRMWoCYRQE4O+XtFqlS5dCUtosuUuwzjnSBlLYeY7gBXYLD+EdFCwsLIRJsUKCLpu1cODBwDDvzfCQmmTg1FoyFMnIjbgwZEIO5HWgwRu+8d6b6w9fkEeya6/1dkiFNWWLFeZd60t7oRTyhSNOeEJFmXWkSciYfFyIm+vyv5GWeCblLEyxxyd56Sl9/8f9jwc0N8RqfgDCNk06qDb5gAAAAABJRU5ErkJggg==';

				assert.equal(the_canvas.toDataURL("image/png", 0), expected, 'captured dataurl matches expected');
				done();

			});
	});

	QUnit.test('screenShooter.hiddenClone should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.hiddenClone, 'function', 'screenShooter.hiddenClone should be a valid method');
	});

})(QUnit);
