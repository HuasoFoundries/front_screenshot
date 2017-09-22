import ascii from "rollup-plugin-ascii";
import resolve from "rollup-plugin-node-resolve";
import replace from 'rollup-plugin-replace';
import babel from "rollup-plugin-babel";
import babelrc from 'babelrc-rollup';

const babelConfig2 = {
	"plugins": ["syntax-flow", "transform-object-rest-spread", "external-helpers"],
	"presets": [
		["latest",
			{
				"es2015": {
					"modules": false
				}
			}
		], "flow"
	]
};

const babelConfig = {
	'presets': [
		['env', {
			'targets': {
				'browsers': ['last 2 versions']
			},
			'loose': true
		}]
	]
};

export default {
	input: "src/ig_screenshot.es6.js",
	extend: true,

	plugins: [
		babel(babelrc({
			config: babelConfig
		})),
		replace({
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
};
