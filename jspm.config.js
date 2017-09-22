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
            "punycode": "npm:jspm-nodelibs-punycode@0.2.1",
            "canvg": "github:canvg/canvg@v1.4",
            "html2canvas": "github:niklasvh/html2canvas@master",
            "https": "npm:jspm-nodelibs-https@0.2.2",
            "url": "npm:jspm-nodelibs-url@0.2.1",
            "http": "npm:jspm-nodelibs-http@0.2.0"
        },
        "packages": {
            "npm:jspm-nodelibs-punycode@0.2.1": {
                "map": {
                    "punycode": "npm:punycode@1.3.2"
                }
            },
            "github:niklasvh/html2canvas@master": {
                "map": {
                    "punycode": "npm:punycode@2.1.0"
                }
            },
            "npm:jspm-nodelibs-url@0.2.1": {
                "map": {
                    "url": "npm:url@0.11.0"
                }
            },
            "npm:url@0.11.0": {
                "map": {
                    "punycode": "npm:punycode@1.3.2",
                    "querystring": "npm:querystring@0.2.0"
                }
            },
            "npm:jspm-nodelibs-http@0.2.0": {
                "map": {
                    "http-browserify": "npm:stream-http@2.7.2"
                }
            },
            "npm:stream-http@2.7.2": {
                "map": {
                    "inherits": "npm:inherits@2.0.3",
                    "readable-stream": "npm:readable-stream@2.3.3",
                    "xtend": "npm:xtend@4.0.1",
                    "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
                    "builtin-status-codes": "npm:builtin-status-codes@3.0.0"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    packages: {
        "screenshooter-lib-js": {
            "main": "ig_screenshot.js",
            "defaultExtension": "js",
            "format": "esm",
            "map": {
                "rgbcolor": "canvg/rgbcolor.js"
            },
            "meta": {
                "*.js": {
                    "loader": "plugin-babel"
                }
            }
        },
        "html2canvas_es6": {
            "main": "index.js",
            "defaultExtension": "js",
            "format": "esm",
            "meta": {
                "*.js": {
                    "loader": "plugin-babel"
                }
            }
        },
        "src": {
            "main": "ig_screenshot.js",
            "format": "esm",
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
        "assert": "npm:jspm-nodelibs-assert@0.2.1",
        "buffer": "npm:jspm-nodelibs-buffer@0.2.3",
        "constants": "npm:jspm-nodelibs-constants@0.2.1",
        "crypto": "npm:jspm-nodelibs-crypto@0.2.1",
        "events": "npm:jspm-nodelibs-events@0.2.2",
        "fs": "npm:jspm-nodelibs-fs@0.2.1",
        "os": "npm:jspm-nodelibs-os@0.2.2",
        "path": "npm:jspm-nodelibs-path@0.2.3",
        "plugin-babel": "npm:systemjs-plugin-babel@0.0.25",
        "process": "npm:jspm-nodelibs-process@0.2.1",
        "stream": "npm:jspm-nodelibs-stream@0.2.1",
        "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.1",
        "util": "npm:jspm-nodelibs-util@0.2.2",
        "vm": "npm:jspm-nodelibs-vm@0.2.1"
    },
    packages: {
        "npm:jspm-nodelibs-buffer@0.2.3": {
            "map": {
                "buffer": "npm:buffer@5.0.7"
            }
        },
        "npm:buffer@5.0.7": {
            "map": {
                "base64-js": "npm:base64-js@1.2.1",
                "ieee754": "npm:ieee754@1.1.8"
            }
        },
        "npm:readable-stream@2.3.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "isarray": "npm:isarray@1.0.0",
                "process-nextick-args": "npm:process-nextick-args@1.0.7",
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "core-util-is": "npm:core-util-is@1.0.2",
                "util-deprecate": "npm:util-deprecate@1.0.2",
                "string_decoder": "npm:string_decoder@1.0.3"
            }
        },
        "npm:jspm-nodelibs-crypto@0.2.1": {
            "map": {
                "crypto-browserify": "npm:crypto-browserify@3.11.1"
            }
        },
        "npm:crypto-browserify@3.11.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "browserify-sign": "npm:browserify-sign@4.0.4",
                "browserify-cipher": "npm:browserify-cipher@1.0.0",
                "create-ecdh": "npm:create-ecdh@4.0.0",
                "diffie-hellman": "npm:diffie-hellman@5.0.2",
                "pbkdf2": "npm:pbkdf2@3.0.14",
                "create-hmac": "npm:create-hmac@1.1.6",
                "randombytes": "npm:randombytes@2.0.5",
                "create-hash": "npm:create-hash@1.1.3",
                "public-encrypt": "npm:public-encrypt@4.0.0"
            }
        },
        "npm:jspm-nodelibs-os@0.2.2": {
            "map": {
                "os-browserify": "npm:os-browserify@0.3.0"
            }
        },
        "npm:string_decoder@1.0.3": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:browserify-sign@4.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "create-hmac": "npm:create-hmac@1.1.6",
                "create-hash": "npm:create-hash@1.1.3",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "bn.js": "npm:bn.js@4.11.8",
                "parse-asn1": "npm:parse-asn1@5.1.0",
                "elliptic": "npm:elliptic@6.4.0"
            }
        },
        "npm:create-hmac@1.1.6": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "create-hash": "npm:create-hash@1.1.3",
                "sha.js": "npm:sha.js@2.4.8",
                "ripemd160": "npm:ripemd160@2.0.1",
                "cipher-base": "npm:cipher-base@1.0.4"
            }
        },
        "npm:diffie-hellman@5.0.2": {
            "map": {
                "randombytes": "npm:randombytes@2.0.5",
                "bn.js": "npm:bn.js@4.11.8",
                "miller-rabin": "npm:miller-rabin@4.0.0"
            }
        },
        "npm:pbkdf2@3.0.14": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "create-hmac": "npm:create-hmac@1.1.6",
                "create-hash": "npm:create-hash@1.1.3",
                "sha.js": "npm:sha.js@2.4.8",
                "ripemd160": "npm:ripemd160@2.0.1"
            }
        },
        "npm:randombytes@2.0.5": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:create-hash@1.1.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "sha.js": "npm:sha.js@2.4.8",
                "ripemd160": "npm:ripemd160@2.0.1",
                "cipher-base": "npm:cipher-base@1.0.4"
            }
        },
        "npm:public-encrypt@4.0.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.3",
                "randombytes": "npm:randombytes@2.0.5",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "bn.js": "npm:bn.js@4.11.8",
                "parse-asn1": "npm:parse-asn1@5.1.0"
            }
        },
        "npm:jspm-nodelibs-stream@0.2.1": {
            "map": {
                "stream-browserify": "npm:stream-browserify@2.0.1"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "readable-stream": "npm:readable-stream@2.3.3"
            }
        },
        "npm:browserify-rsa@4.0.1": {
            "map": {
                "randombytes": "npm:randombytes@2.0.5",
                "bn.js": "npm:bn.js@4.11.8"
            }
        },
        "npm:create-ecdh@4.0.0": {
            "map": {
                "bn.js": "npm:bn.js@4.11.8",
                "elliptic": "npm:elliptic@6.4.0"
            }
        },
        "npm:sha.js@2.4.8": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:ripemd160@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "hash-base": "npm:hash-base@2.0.2"
            }
        },
        "npm:browserify-cipher@1.0.0": {
            "map": {
                "browserify-des": "npm:browserify-des@1.0.0",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "browserify-aes": "npm:browserify-aes@1.0.8"
            }
        },
        "npm:browserify-des@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.4",
                "des.js": "npm:des.js@1.0.0"
            }
        },
        "npm:parse-asn1@5.1.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.3",
                "pbkdf2": "npm:pbkdf2@3.0.14",
                "browserify-aes": "npm:browserify-aes@1.0.8",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "asn1.js": "npm:asn1.js@4.9.1"
            }
        },
        "npm:evp_bytestokey@1.0.3": {
            "map": {
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "md5.js": "npm:md5.js@1.3.4"
            }
        },
        "npm:browserify-aes@1.0.8": {
            "map": {
                "create-hash": "npm:create-hash@1.1.3",
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1",
                "cipher-base": "npm:cipher-base@1.0.4",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
                "buffer-xor": "npm:buffer-xor@1.0.3"
            }
        },
        "npm:cipher-base@1.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:elliptic@6.4.0": {
            "map": {
                "bn.js": "npm:bn.js@4.11.8",
                "inherits": "npm:inherits@2.0.3",
                "hmac-drbg": "npm:hmac-drbg@1.0.1",
                "hash.js": "npm:hash.js@1.1.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
                "brorand": "npm:brorand@1.1.0",
                "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
            }
        },
        "npm:miller-rabin@4.0.0": {
            "map": {
                "bn.js": "npm:bn.js@4.11.8",
                "brorand": "npm:brorand@1.1.0"
            }
        },
        "npm:des.js@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:md5.js@1.3.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "hash-base": "npm:hash-base@3.0.4"
            }
        },
        "npm:jspm-nodelibs-string_decoder@0.2.1": {
            "map": {
                "string_decoder": "npm:string_decoder@0.10.31"
            }
        },
        "npm:hmac-drbg@1.0.1": {
            "map": {
                "hash.js": "npm:hash.js@1.1.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
                "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1"
            }
        },
        "npm:hash.js@1.1.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:hash-base@2.0.2": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:hash-base@3.0.4": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "safe-buffer": "npm:safe-buffer@5.1.1"
            }
        },
        "npm:asn1.js@4.9.1": {
            "map": {
                "bn.js": "npm:bn.js@4.11.8",
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        }
    }
});
