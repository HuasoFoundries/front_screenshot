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
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAk0lEQVQoz6XRMQrCUAzG8V/Vyc0DuDm6uzvrAbp6L/cu4gUUWvAYXevkGYyDb3rwaMVASAh8+f4hiJaIidn6NlMjYpYNDmnTtiTJBGo8Ui3bpLokBmJD9FOQjrhR9XgSuzGkGk3qmxJWlZBWGPBCYJ6WraneGX4EcSLOGe+d2JduqHHN3C8FrL8eNx4/CxbofsDqPgU+TM3EcgqEAAAAAElFTkSuQmCC';

				assert.equal(the_canvas.toDataURL("image/png", 0), expected, 'captured dataurl matches expected');
				done();

			});
	});

	QUnit.test('screenShooter.hiddenClone should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.hiddenClone, 'function', 'screenShooter.hiddenClone should be a valid method');
	});

})(QUnit);
