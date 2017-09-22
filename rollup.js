import ascii from "rollup-plugin-ascii";
import resolve from "rollup-plugin-node-resolve";
import replace from 'rollup-plugin-replace';
import babel from "rollup-plugin-babel";
import babelrc from 'babelrc-rollup';
import commonjs from 'rollup-plugin-commonjs';
import {
	rollup
} from 'rollup';

const babelConfig = {
	//"runtimeHelpers": true,
	//"externalHelpers": false,
	"babelrc": false,
	"plugins": ["external-helpers"],
	'presets': [
		['env', {
			'targets': {
				'browsers': ['last 2 versions']
			},
			'loose': true
		}]
	]
};

const rollup_conf = {
	//input: "src/html2canvas/index.js",
	//input: "html2canvas/index.js",
	input: "src/ig_screenshot.js",
	extend: true,

	plugins: [
		replace({
			'__VERSION__': '1.0.0-beta.1',
			'__DEV__': false,
			'const': 'var',
			'let': 'var'
		}),
		commonjs({
			namedExports: {
				'./node_modules/punycode/punycode.js': ['version', 'ucs2', 'decode', 'encode', 'toASCII', 'toUnicode']
			},
		}),
		babel(babelrc({
			config: babelConfig

		})),

		resolve({
			preferBuiltins: false,
		}),
		ascii()
	],
	output: [{
		file: "dist/ig_screenshot.js",
		format: "es",
		name: "screenShooter"
	}, {
		file: "dist/ig_screenshot.bundle.js",
		format: "umd",
		exports: 'named',
		name: "screenShooter"
	}]
};

rollup(rollup_conf).then(function (result) {
	console.log(result);
});

/*export default {
	input: "src/ig_screenshot.es6.js",
	extend: true,

	plugins: [
		babel(babelrc({
			config: babelConfig,
		})),
		replace({
			'__VERSION__': '1.0.0-beta.1',
			'__DEV__': false,
			'const': 'var',
			'let': 'var'
		}),
		resolve({
			jsnext: true,
			preferBuiltins: false,
		}), ascii()
	],
	output: [{
		file: "dist/ig_screenshot.js",
		format: "es",
		name: "screenShooter"
	}, {
		file: "dist/ig_screenshot.min.js",
		format: "umd",
		exports: 'named',
		name: "screenShooter"
	}, {
		file: "dist/ig_screenshot.bundle.js",
		format: "umd",
		exports: 'named',
		name: "screenShooter"
	}]
};*/
