(function (QUnit) {

	QUnit.module("screenShooter general methods");

	QUnit.test('screenShooter.infoScreenShot should be of type function', function (assert) {
		assert.equal(typeof screenShooter.infoScreenShot, 'function', 'infoScreenShot should be if type function');
	});

	QUnit.test('screenShooter.infoScreenShot should render a container as a canvas with the expected contents', function (assert) {

		var done = assert.async();

		screenShooter.infoScreenShot(jQuery('#text_container'))
			.then(function (dataurl) {

				var expected =
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAACuUlEQVQoFQGuAlH9AQAA/54AAAAiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3gEAAP/4AAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AgAAAAAAAAAAAAAAAAAA/w4AAP/0AAD/NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAABaAAAAsQAAAGYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAD/kAAA/xQAAP/tAAD/DgAAAAAAAAAAAAAAAAAAAAAAAP//AgAAAAAAAAAAAAD/NQAAAMUAAAHsAAAAswAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAP//AAABAQAA/4wAAAD4AAAA/AAAABsAAAA1AAABMAAAAAAAAAAAAAAAAAAA//8AAAD//wAA/w0AAP+AAAAAAAAAAAAAAAAAAAD/2QAA/zcAAAAAAAAAAAAAAAAAAP//AgAAAAAAAACXAAAAIgAA/wEAAAAAAAD/JgAAAPAAAACJAAD/KAAAAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAP/MAAAA9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyb/zqsLWcLewAAAABJRU5ErkJggg==';

				assert.equal(dataurl, expected, 'captured dataurl matches expected');
				done();

			});
	});

	QUnit.test('screenShooter.hiddenClone should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.hiddenClone, 'function', 'screenShooter.hiddenClone should be a valid method');
	});

})(QUnit);
