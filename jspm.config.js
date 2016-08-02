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
            "punycode": "github:jspm/nodelibs-punycode@0.1.0",
            "html2canvas": "github:niklasvh/html2canvas@0.5.0-beta4",
            "canvg": "github:gabelerner/canvg@v1.4"
        },
        "packages": {
            "github:jspm/nodelibs-punycode@0.1.0": {
                "map": {
                    "punycode": "npm:punycode@1.4.1"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    packages: {
        "screenshooter-lib-js": {
            "main": "dist/index.js",
            "format": "amd",
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
        "plugin-babel": "npm:systemjs-plugin-babel@0.0.13"
    },
    packages: {}
});
