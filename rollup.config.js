import ascii from "rollup-plugin-ascii";
import resolve from "rollup-plugin-node-resolve";
import replace from 'rollup-plugin-replace';
import babel from "rollup-plugin-babel";
import commonjs from 'rollup-plugin-commonjs';

export default {
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
		/*babel(babelrc({
			config: babelConfig

		})),*/
		babel({
			"presets": ["es2015-rollup"],
			plugins: ['external-helpers'],
			//runtimeHelpers: true,
			//"externalHelpers": true,
			exclude: ['node_modules/babel-runtime/**', 'node_modules/babel-helpers/**'],
			"babelrc": false
		}),

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
