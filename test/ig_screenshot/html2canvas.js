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
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAk0lEQVQoz6XRMQrCUAzG8V/Vyc0DuDm6uzvrAbp6L/cu4gUUWvAYXevkGYyDb3rwaMVASAh8+f4hiJaIidn6NlMjYpYNDmnTtiTJBGo8Ui3bpLokBmJD9FOQjrhR9XgSuzGkGk3qmxJWlZBWGPBCYJ6WraneGX4EcSLOGe+d2JduqHHN3C8FrL8eNx4/CxbofsDqPgU+TM3EcgqEAAAAAElFTkSuQmCC'; // eslint-disable-line max-len

			assert.equal(dataurl.substring(0, 98), expected.substring(0, 98), 'captured dataurl matches expected');
			done();

		});
	});

}(QUnit));
