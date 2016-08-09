(function (QUnit) {

    QUnit.module("screenShooter Entities");

    QUnit.test('infoScreenShot should be if type function', function (assert) {
        assert.equal(typeof screenShooter.infoScreenShot, 'function', 'infoScreenShot should be if type function');
    });

    QUnit.test('screenShooter.html2canvas should be a valid method', function (assert) {
        assert.equal(typeof screenShooter.html2canvas, 'function', 'screenShooter.html2canvas should be a valid method');
    });

})(QUnit);
