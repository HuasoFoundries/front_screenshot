SystemJS.config({
    paths: {
        "npm:": "jspm_packages/npm/",
        "github:": "jspm_packages/github/",
        "screenshooter-lib-js/": "src/"
    },
    browserConfig: {
        "baseURL": "/"
    },
    devConfig: {
        "map": {
            "punycode": "npm:jspm-nodelibs-punycode@0.2.0",
            "html2canvas": "github:niklasvh/html2canvas@0.5.0-beta4",
            "canvg": "github:canvg/canvg@v1.4"
        },
        "packages": {

            "npm:jspm-nodelibs-punycode@0.2.0": {
                "map": {
                    "punycode-browserify": "npm:punycode@1.4.1"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    packages: {

        "src": {
            "main": "ig_screenshot.js",
            "map": {
                "rgbcolor": "canvg/rgbcolor.js"
            }
        },
        "screenshooter-lib-js": {
            "main": "dist/index.js",
            "format": "amd",
            "map": {
                "rgbcolor": "canvg/rgbcolor.js"
            },
            "meta": {
                "*.js": {
                    "loader": "plugin-babel"
                }
            }
        }
    }
});

SystemJS.config({
    packageConfigPaths: [
        "npm:@*/*.json",
        "npm:*.json",
        "github:*/*.json"
    ],
    map: {
        "plugin-babel": "npm:systemjs-plugin-babel@0.0.17"
    },
    packages: {}
});
