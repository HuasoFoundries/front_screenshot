(function (QUnit) {

	QUnit.module("html2canvas methods");

	QUnit.test('screenShooter.html2canvas should be a valid method', function (assert) {
		assert.equal(typeof screenShooter.html2canvas, 'function', 'screenShooter.html2canvas should be a valid method');
	});

	QUnit.test('screenShooter.html2canvas should render a container as a canvas with the expected contents', function (assert) {

		var done = assert.async();

		screenShooter.html2canvas(document.getElementById('text_container'), {
			useCORS: true,
			allowTaint: false,
			logging: false
		}).then(function (canvas) {

			var dataurl = canvas.toDataURL("image/png", 0);
			var expected =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAnUlEQVQoz7XRMWoCYRQE4O+XtFqlS5dCUtosuUuwzjnSBlLYeY7gBXYLD+EdFCwsLIRJsUKCLpu1cODBwDDvzfCQmmTg1FoyFMnIjbgwZEIO5HWgwRu+8d6b6w9fkEeya6/1dkiFNWWLFeZd60t7oRTyhSNOeEJFmXWkSciYfFyIm+vyv5GWeCblLEyxxyd56Sl9/8f9jwc0N8RqfgDCNk06qDb5gAAAAABJRU5ErkJggg==';

			assert.equal(dataurl, expected, 'captured dataurl matches expected');
			done();

		});
	});

})(QUnit);
