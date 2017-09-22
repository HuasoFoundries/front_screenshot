function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

'use strict';
// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign$2 = _core.Object.assign;

var assign = createCommonjsModule(function (module) {
module.exports = { "default": assign$2, __esModule: true };
});

unwrapExports(assign);

var _extends = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _assign2 = _interopRequireDefault(assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
});

var _extends$1 = unwrapExports(_extends);

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

'use strict';



var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

'use strict';









var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

'use strict';
var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

'use strict';





// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i$1 = 0; i$1 < DOMIterables.length; i$1++) {
  var NAME = DOMIterables[i$1];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$3 = _wks;

var _wksExt = {
	f: f$3
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

unwrapExports(iterator);

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$1 = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$4
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD$1(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

'use strict';
// ECMAScript 6 symbols shim





var META = _meta.KEY;


















var gOPD = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !_isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol$2 = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": symbol$2, __esModule: true };
});

unwrapExports(symbol);

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process$1 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process$1) == 'process') {
    defer = function (id) {
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise = _global.Promise;
var isNode$1 = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode$1 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

'use strict';
// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$7 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$7
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

'use strict';




var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

'use strict';










var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process = _global.process;
var $Promise = _global[PROMISE];
var isNode = _classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE$1 = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

// https://github.com/tc39/proposal-promise-finally
'use strict';






_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

'use strict';
// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise$1 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$1, __esModule: true };
});

var _Promise = unwrapExports(promise);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty$3 = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$1 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$3, __esModule: true };
});

unwrapExports(defineProperty$1);

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

'use strict';

var PATH = {
    VECTOR: 0,
    BEZIER_CURVE: 1,
    CIRCLE: 2
};

var ITERATOR$4 = _wks('iterator');

var core_isIterable = _core.isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$4] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable$2 = core_isIterable;

var isIterable = createCommonjsModule(function (module) {
module.exports = { "default": isIterable$2, __esModule: true };
});

unwrapExports(isIterable);

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator$2 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$2, __esModule: true };
});

unwrapExports(getIterator);

var slicedToArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _isIterable3 = _interopRequireDefault(isIterable);



var _getIterator3 = _interopRequireDefault(getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
});

var _slicedToArray = unwrapExports(slicedToArray);

'use strict';

// http://dev.w3.org/csswg/css-color/

var HEX3 = /^#([a-f0-9]{3})$/i;
var hex3 = function hex3(value) {
    var match = value.match(HEX3);
    if (match) {
        return [parseInt(match[1][0] + match[1][0], 16), parseInt(match[1][1] + match[1][1], 16), parseInt(match[1][2] + match[1][2], 16), null];
    }
    return false;
};

var HEX6 = /^#([a-f0-9]{6})$/i;
var hex6 = function hex6(value) {
    var match = value.match(HEX6);
    if (match) {
        return [parseInt(match[1].substring(0, 2), 16), parseInt(match[1].substring(2, 4), 16), parseInt(match[1].substring(4, 6), 16), null];
    }
    return false;
};

var RGB = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
var rgb = function rgb(value) {
    var match = value.match(RGB);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), null];
    }
    return false;
};

var RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;
var rgba = function rgba(value) {
    var match = value.match(RGBA);
    if (match && match.length > 4) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])];
    }
    return false;
};

var fromArray = function fromArray(array) {
    return [Math.min(array[0], 255), Math.min(array[1], 255), Math.min(array[2], 255), array.length > 3 ? array[3] : null];
};

var namedColor = function namedColor(name) {
    var color = NAMED_COLORS[name.toLowerCase()];
    return color ? color : false;
};

var Color = function () {
    function Color(value) {
        _classCallCheck(this, Color);

        var _ref = Array.isArray(value) ? fromArray(value) : hex3(value) || rgb(value) || rgba(value) || namedColor(value) || hex6(value) || [0, 0, 0, null],
            _ref2 = _slicedToArray(_ref, 4),
            r = _ref2[0],
            g = _ref2[1],
            b = _ref2[2],
            a = _ref2[3];

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    _createClass(Color, [{
        key: 'isTransparent',
        value: function isTransparent() {
            return this.a === 0;
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.a !== null && this.a !== 1 ? 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')' : 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        }
    }]);

    return Color;
}();

var NAMED_COLORS = {
    transparent: [0, 0, 0, 0],
    aliceblue: [240, 248, 255, null],
    antiquewhite: [250, 235, 215, null],
    aqua: [0, 255, 255, null],
    aquamarine: [127, 255, 212, null],
    azure: [240, 255, 255, null],
    beige: [245, 245, 220, null],
    bisque: [255, 228, 196, null],
    black: [0, 0, 0, null],
    blanchedalmond: [255, 235, 205, null],
    blue: [0, 0, 255, null],
    blueviolet: [138, 43, 226, null],
    brown: [165, 42, 42, null],
    burlywood: [222, 184, 135, null],
    cadetblue: [95, 158, 160, null],
    chartreuse: [127, 255, 0, null],
    chocolate: [210, 105, 30, null],
    coral: [255, 127, 80, null],
    cornflowerblue: [100, 149, 237, null],
    cornsilk: [255, 248, 220, null],
    crimson: [220, 20, 60, null],
    cyan: [0, 255, 255, null],
    darkblue: [0, 0, 139, null],
    darkcyan: [0, 139, 139, null],
    darkgoldenrod: [184, 134, 11, null],
    darkgray: [169, 169, 169, null],
    darkgreen: [0, 100, 0, null],
    darkgrey: [169, 169, 169, null],
    darkkhaki: [189, 183, 107, null],
    darkmagenta: [139, 0, 139, null],
    darkolivegreen: [85, 107, 47, null],
    darkorange: [255, 140, 0, null],
    darkorchid: [153, 50, 204, null],
    darkred: [139, 0, 0, null],
    darksalmon: [233, 150, 122, null],
    darkseagreen: [143, 188, 143, null],
    darkslateblue: [72, 61, 139, null],
    darkslategray: [47, 79, 79, null],
    darkslategrey: [47, 79, 79, null],
    darkturquoise: [0, 206, 209, null],
    darkviolet: [148, 0, 211, null],
    deeppink: [255, 20, 147, null],
    deepskyblue: [0, 191, 255, null],
    dimgray: [105, 105, 105, null],
    dimgrey: [105, 105, 105, null],
    dodgerblue: [30, 144, 255, null],
    firebrick: [178, 34, 34, null],
    floralwhite: [255, 250, 240, null],
    forestgreen: [34, 139, 34, null],
    fuchsia: [255, 0, 255, null],
    gainsboro: [220, 220, 220, null],
    ghostwhite: [248, 248, 255, null],
    gold: [255, 215, 0, null],
    goldenrod: [218, 165, 32, null],
    gray: [128, 128, 128, null],
    green: [0, 128, 0, null],
    greenyellow: [173, 255, 47, null],
    grey: [128, 128, 128, null],
    honeydew: [240, 255, 240, null],
    hotpink: [255, 105, 180, null],
    indianred: [205, 92, 92, null],
    indigo: [75, 0, 130, null],
    ivory: [255, 255, 240, null],
    khaki: [240, 230, 140, null],
    lavender: [230, 230, 250, null],
    lavenderblush: [255, 240, 245, null],
    lawngreen: [124, 252, 0, null],
    lemonchiffon: [255, 250, 205, null],
    lightblue: [173, 216, 230, null],
    lightcoral: [240, 128, 128, null],
    lightcyan: [224, 255, 255, null],
    lightgoldenrodyellow: [250, 250, 210, null],
    lightgray: [211, 211, 211, null],
    lightgreen: [144, 238, 144, null],
    lightgrey: [211, 211, 211, null],
    lightpink: [255, 182, 193, null],
    lightsalmon: [255, 160, 122, null],
    lightseagreen: [32, 178, 170, null],
    lightskyblue: [135, 206, 250, null],
    lightslategray: [119, 136, 153, null],
    lightslategrey: [119, 136, 153, null],
    lightsteelblue: [176, 196, 222, null],
    lightyellow: [255, 255, 224, null],
    lime: [0, 255, 0, null],
    limegreen: [50, 205, 50, null],
    linen: [250, 240, 230, null],
    magenta: [255, 0, 255, null],
    maroon: [128, 0, 0, null],
    mediumaquamarine: [102, 205, 170, null],
    mediumblue: [0, 0, 205, null],
    mediumorchid: [186, 85, 211, null],
    mediumpurple: [147, 112, 219, null],
    mediumseagreen: [60, 179, 113, null],
    mediumslateblue: [123, 104, 238, null],
    mediumspringgreen: [0, 250, 154, null],
    mediumturquoise: [72, 209, 204, null],
    mediumvioletred: [199, 21, 133, null],
    midnightblue: [25, 25, 112, null],
    mintcream: [245, 255, 250, null],
    mistyrose: [255, 228, 225, null],
    moccasin: [255, 228, 181, null],
    navajowhite: [255, 222, 173, null],
    navy: [0, 0, 128, null],
    oldlace: [253, 245, 230, null],
    olive: [128, 128, 0, null],
    olivedrab: [107, 142, 35, null],
    orange: [255, 165, 0, null],
    orangered: [255, 69, 0, null],
    orchid: [218, 112, 214, null],
    palegoldenrod: [238, 232, 170, null],
    palegreen: [152, 251, 152, null],
    paleturquoise: [175, 238, 238, null],
    palevioletred: [219, 112, 147, null],
    papayawhip: [255, 239, 213, null],
    peachpuff: [255, 218, 185, null],
    peru: [205, 133, 63, null],
    pink: [255, 192, 203, null],
    plum: [221, 160, 221, null],
    powderblue: [176, 224, 230, null],
    purple: [128, 0, 128, null],
    rebeccapurple: [102, 51, 153, null],
    red: [255, 0, 0, null],
    rosybrown: [188, 143, 143, null],
    royalblue: [65, 105, 225, null],
    saddlebrown: [139, 69, 19, null],
    salmon: [250, 128, 114, null],
    sandybrown: [244, 164, 96, null],
    seagreen: [46, 139, 87, null],
    seashell: [255, 245, 238, null],
    sienna: [160, 82, 45, null],
    silver: [192, 192, 192, null],
    skyblue: [135, 206, 235, null],
    slateblue: [106, 90, 205, null],
    slategray: [112, 128, 144, null],
    slategrey: [112, 128, 144, null],
    snow: [255, 250, 250, null],
    springgreen: [0, 255, 127, null],
    steelblue: [70, 130, 180, null],
    tan: [210, 180, 140, null],
    teal: [0, 128, 128, null],
    thistle: [216, 191, 216, null],
    tomato: [255, 99, 71, null],
    turquoise: [64, 224, 208, null],
    violet: [238, 130, 238, null],
    wheat: [245, 222, 179, null],
    white: [255, 255, 255, null],
    whitesmoke: [245, 245, 245, null],
    yellow: [255, 255, 0, null],
    yellowgreen: [154, 205, 50, null]
};

var TRANSPARENT = new Color([0, 0, 0, 0]);

'use strict';

var TEXT_DECORATION_STYLE = {
    SOLID: 0,
    DOUBLE: 1,
    DOTTED: 2,
    DASHED: 3,
    WAVY: 4
};

var TEXT_DECORATION = {
    NONE: null
};

var TEXT_DECORATION_LINE = {
    UNDERLINE: 1,
    OVERLINE: 2,
    LINE_THROUGH: 3,
    BLINK: 4
};

var parseLine = function parseLine(line) {
    switch (line) {
        case 'underline':
            return TEXT_DECORATION_LINE.UNDERLINE;
        case 'overline':
            return TEXT_DECORATION_LINE.OVERLINE;
        case 'line-through':
            return TEXT_DECORATION_LINE.LINE_THROUGH;
    }
    return TEXT_DECORATION_LINE.BLINK;
};

var parseTextDecorationLine = function parseTextDecorationLine(line) {
    if (line === 'none') {
        return null;
    }

    return line.split(' ').map(parseLine);
};

var parseTextDecorationStyle = function parseTextDecorationStyle(style) {
    switch (style) {
        case 'double':
            return TEXT_DECORATION_STYLE.DOUBLE;
        case 'dotted':
            return TEXT_DECORATION_STYLE.DOTTED;
        case 'dashed':
            return TEXT_DECORATION_STYLE.DASHED;
        case 'wavy':
            return TEXT_DECORATION_STYLE.WAVY;
    }
    return TEXT_DECORATION_STYLE.SOLID;
};

var parseTextDecoration = function parseTextDecoration(style) {
    var textDecorationLine = parseTextDecorationLine(style.textDecorationLine ? style.textDecorationLine : style.textDecoration);
    if (textDecorationLine === null) {
        return TEXT_DECORATION.NONE;
    }

    var textDecorationColor = style.textDecorationColor ? new Color(style.textDecorationColor) : null;
    var textDecorationStyle = parseTextDecorationStyle(style.textDecorationStyle);

    return {
        textDecorationLine: textDecorationLine,
        textDecorationColor: textDecorationColor,
        textDecorationStyle: textDecorationStyle
    };
};

'use strict';

var CanvasRenderer = function () {
    function CanvasRenderer(canvas) {
        _classCallCheck(this, CanvasRenderer);

        this.canvas = canvas ? canvas : document.createElement('canvas');
    }

    _createClass(CanvasRenderer, [{
        key: 'render',
        value: function render(options) {
            this.ctx = this.canvas.getContext('2d');
            this.options = options;
            this.canvas.width = Math.floor(options.width * options.scale);
            this.canvas.height = Math.floor(options.height * options.scale);
            this.canvas.style.width = options.width + 'px';
            this.canvas.style.height = options.height + 'px';

            this.ctx.scale(this.options.scale, this.options.scale);
            this.ctx.textBaseline = 'bottom';
            options.logger.log('Canvas renderer initialized with scale ' + this.options.scale);
        }
    }, {
        key: 'clip',
        value: function clip(clipPaths, callback) {
            var _this = this;

            if (clipPaths.length) {
                this.ctx.save();
                clipPaths.forEach(function (path) {
                    _this.path(path);
                    _this.ctx.clip();
                });
            }

            callback();

            if (clipPaths.length) {
                this.ctx.restore();
            }
        }
    }, {
        key: 'drawImage',
        value: function drawImage(image, source, destination) {
            this.ctx.drawImage(image, source.left, source.top, source.width, source.height, destination.left, destination.top, destination.width, destination.height);
        }
    }, {
        key: 'drawShape',
        value: function drawShape(path, color) {
            this.path(path);
            this.ctx.fillStyle = color.toString();
            this.ctx.fill();
        }
    }, {
        key: 'fill',
        value: function fill(color) {
            this.ctx.fillStyle = color.toString();
            this.ctx.fill();
        }
    }, {
        key: 'getTarget',
        value: function getTarget() {
            return _Promise.resolve(this.canvas);
        }
    }, {
        key: 'path',
        value: function path(_path) {
            var _this2 = this;

            this.ctx.beginPath();
            if (Array.isArray(_path)) {
                _path.forEach(function (point, index) {
                    var start = point.type === PATH.VECTOR ? point : point.start;
                    if (index === 0) {
                        _this2.ctx.moveTo(start.x, start.y);
                    } else {
                        _this2.ctx.lineTo(start.x, start.y);
                    }

                    if (point.type === PATH.BEZIER_CURVE) {
                        _this2.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
                    }
                });
            } else {
                this.ctx.arc(_path.x + _path.radius, _path.y + _path.radius, _path.radius, 0, Math.PI * 2, true);
            }

            this.ctx.closePath();
        }
    }, {
        key: 'rectangle',
        value: function rectangle(x, y, width, height, color) {
            this.ctx.fillStyle = color.toString();
            this.ctx.fillRect(x, y, width, height);
        }
    }, {
        key: 'renderLinearGradient',
        value: function renderLinearGradient(bounds, gradient) {
            var linearGradient = this.ctx.createLinearGradient(bounds.left + gradient.direction.x1, bounds.top + gradient.direction.y1, bounds.left + gradient.direction.x0, bounds.top + gradient.direction.y0);

            gradient.colorStops.forEach(function (colorStop) {
                linearGradient.addColorStop(colorStop.stop, colorStop.color.toString());
            });

            this.ctx.fillStyle = linearGradient;
            this.ctx.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
        }
    }, {
        key: 'renderRepeat',
        value: function renderRepeat(path, image, imageSize, offsetX, offsetY) {
            this.path(path);
            this.ctx.fillStyle = this.ctx.createPattern(this.resizeImage(image, imageSize), 'repeat');
            this.ctx.translate(offsetX, offsetY);
            this.ctx.fill();
            this.ctx.translate(-offsetX, -offsetY);
        }
    }, {
        key: 'renderTextNode',
        value: function renderTextNode(textBounds, color, font, textDecoration, textShadows) {
            var _this3 = this;

            this.ctx.font = [font.fontStyle, font.fontVariant, font.fontWeight, font.fontSize, font.fontFamily].join(' ').split(',')[0];

            textBounds.forEach(function (text) {
                _this3.ctx.fillStyle = color.toString();
                if (textShadows && text.text.trim().length) {
                    textShadows.slice(0).reverse().forEach(function (textShadow) {
                        _this3.ctx.shadowColor = textShadow.color.toString();
                        _this3.ctx.shadowOffsetX = textShadow.offsetX * _this3.options.scale;
                        _this3.ctx.shadowOffsetY = textShadow.offsetY * _this3.options.scale;
                        _this3.ctx.shadowBlur = textShadow.blur;

                        _this3.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
                    });
                } else {
                    _this3.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
                }

                if (textDecoration !== null) {
                    var textDecorationColor = textDecoration.textDecorationColor || color;
                    textDecoration.textDecorationLine.forEach(function (textDecorationLine) {
                        switch (textDecorationLine) {
                            case TEXT_DECORATION_LINE.UNDERLINE:
                                // Draws a line at the baseline of the font
                                // TODO As some browsers display the line as more than 1px if the font-size is big,
                                // need to take that into account both in position and size
                                var _options$fontMetrics$ = _this3.options.fontMetrics.getMetrics(font),
                                    baseline = _options$fontMetrics$.baseline;

                                _this3.rectangle(text.bounds.left, Math.round(text.bounds.top + baseline), text.bounds.width, 1, textDecorationColor);
                                break;
                            case TEXT_DECORATION_LINE.OVERLINE:
                                _this3.rectangle(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1, textDecorationColor);
                                break;
                            case TEXT_DECORATION_LINE.LINE_THROUGH:
                                // TODO try and find exact position for line-through
                                var _options$fontMetrics$2 = _this3.options.fontMetrics.getMetrics(font),
                                    middle = _options$fontMetrics$2.middle;

                                _this3.rectangle(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1, textDecorationColor);
                                break;
                        }
                    });
                }
            });
        }
    }, {
        key: 'resizeImage',
        value: function resizeImage(image, size) {
            if (image.width === size.width && image.height === size.height) {
                return image;
            }

            var canvas = this.canvas.ownerDocument.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
            return canvas;
        }
    }, {
        key: 'setOpacity',
        value: function setOpacity(opacity) {
            this.ctx.globalAlpha = opacity;
        }
    }, {
        key: 'transform',
        value: function transform(offsetX, offsetY, matrix, callback) {
            this.ctx.save();
            this.ctx.translate(offsetX, offsetY);
            this.ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
            this.ctx.translate(-offsetX, -offsetY);

            callback();

            this.ctx.restore();
        }
    }]);

    return CanvasRenderer;
}();

'use strict';

var Logger = function () {
    function Logger(id, start) {
        _classCallCheck(this, Logger);

        this.start = start ? start : Date.now();
        this.id = id;
    }

    _createClass(Logger, [{
        key: 'child',
        value: function child(id) {
            return new Logger(id, this.start);
        }

        // eslint-disable-next-line flowtype/no-weak-types

    }, {
        key: 'log',
        value: function log() {
            if (window.console && window.console.log) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? 'html2canvas (' + this.id + '):' : 'html2canvas:'].concat([].slice.call(args, 0)));
            }
        }

        // eslint-disable-next-line flowtype/no-weak-types

    }, {
        key: 'error',
        value: function error() {
            if (window.console && window.console.error) {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                Function.prototype.bind.call(window.console.error, window.console).apply(window.console, [Date.now() - this.start + 'ms', this.id ? 'html2canvas (' + this.id + '):' : 'html2canvas:'].concat([].slice.call(args, 0)));
            }
        }
    }]);

    return Logger;
}();

'use strict';

var contains = function contains(bit, value) {
    return (bit & value) !== 0;
};

var copyCSSStyles = function copyCSSStyles(style, target) {
    // Edge does not provide value for cssText
    for (var i = style.length - 1; i >= 0; i--) {
        var property = style.item(i);
        // Safari shows pseudoelements if content is set
        if (property !== 'content') {
            target.style.setProperty(property, style.getPropertyValue(property));
        }
    }
    return target;
};

var SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

'use strict';

var LENGTH_TYPE = {
    PX: 0,
    PERCENTAGE: 1
};

var Length = function () {
    function Length(value) {
        _classCallCheck(this, Length);

        this.type = value.substr(value.length - 1) === '%' ? LENGTH_TYPE.PERCENTAGE : LENGTH_TYPE.PX;
        var parsedValue = parseFloat(value);
        if (false && isNaN(parsedValue)) {
            console.error('Invalid value given for Length: "' + value + '"');
        }
        this.value = isNaN(parsedValue) ? 0 : parsedValue;
    }

    _createClass(Length, [{
        key: 'isPercentage',
        value: function isPercentage() {
            return this.type === LENGTH_TYPE.PERCENTAGE;
        }
    }, {
        key: 'getAbsoluteValue',
        value: function getAbsoluteValue(parentLength) {
            return this.isPercentage() ? parentLength * (this.value / 100) : this.value;
        }
    }], [{
        key: 'create',
        value: function create(v) {
            return new Length(v);
        }
    }]);

    return Length;
}();

'use strict';

var Size = function Size(width, height) {
    _classCallCheck(this, Size);

    this.width = width;
    this.height = height;
};

'use strict';

var Vector = function Vector(x, y) {
    _classCallCheck(this, Vector);

    this.type = PATH.VECTOR;
    this.x = x;
    this.y = y;
    
};

'use strict';

var lerp = function lerp(a, b, t) {
    return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

var BezierCurve = function () {
    function BezierCurve(start, startControl, endControl, end) {
        _classCallCheck(this, BezierCurve);

        this.type = PATH.BEZIER_CURVE;
        this.start = start;
        this.startControl = startControl;
        this.endControl = endControl;
        this.end = end;
    }

    _createClass(BezierCurve, [{
        key: 'subdivide',
        value: function subdivide(t, firstHalf) {
            var ab = lerp(this.start, this.startControl, t);
            var bc = lerp(this.startControl, this.endControl, t);
            var cd = lerp(this.endControl, this.end, t);
            var abbc = lerp(ab, bc, t);
            var bccd = lerp(bc, cd, t);
            var dest = lerp(abbc, bccd, t);
            return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
        }
    }, {
        key: 'reverse',
        value: function reverse() {
            return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
        }
    }]);

    return BezierCurve;
}();

'use strict';

var TOP = 0;
var RIGHT = 1;
var BOTTOM = 2;
var LEFT = 3;

var H = 0;
var V = 1;

var Bounds = function () {
    function Bounds(x, y, w, h) {
        _classCallCheck(this, Bounds);

        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }

    _createClass(Bounds, null, [{
        key: 'fromClientRect',
        value: function fromClientRect(clientRect) {
            return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
        }
    }]);

    return Bounds;
}();

var parseBounds = function parseBounds(node) {
    return Bounds.fromClientRect(node.getBoundingClientRect());
};

var calculatePaddingBox = function calculatePaddingBox(bounds, borders) {
    return new Bounds(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth));
};

var calculateContentBox = function calculateContentBox(bounds, padding, borders) {
    // TODO support percentage paddings
    var paddingTop = padding[TOP].value;
    var paddingRight = padding[RIGHT].value;
    var paddingBottom = padding[BOTTOM].value;
    var paddingLeft = padding[LEFT].value;

    return new Bounds(bounds.left + paddingLeft + borders[LEFT].borderWidth, bounds.top + paddingTop + borders[TOP].borderWidth, bounds.width - (borders[RIGHT].borderWidth + borders[LEFT].borderWidth + paddingLeft + paddingRight), bounds.height - (borders[TOP].borderWidth + borders[BOTTOM].borderWidth + paddingTop + paddingBottom));
};

var parseDocumentSize = function parseDocumentSize(document) {
    var body = document.body;
    var documentElement = document.documentElement;

    if (!body || !documentElement) {
        throw new Error('');
    }
    var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));

    var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));

    return new Bounds(0, 0, width, height);
};

var parsePathForBorder = function parsePathForBorder(curves, borderSide) {
    switch (borderSide) {
        case TOP:
            return createPathFromCurves(curves.topLeftOuter, curves.topLeftInner, curves.topRightOuter, curves.topRightInner);
        case RIGHT:
            return createPathFromCurves(curves.topRightOuter, curves.topRightInner, curves.bottomRightOuter, curves.bottomRightInner);
        case BOTTOM:
            return createPathFromCurves(curves.bottomRightOuter, curves.bottomRightInner, curves.bottomLeftOuter, curves.bottomLeftInner);
        case LEFT:
        default:
            return createPathFromCurves(curves.bottomLeftOuter, curves.bottomLeftInner, curves.topLeftOuter, curves.topLeftInner);
    }
};

var createPathFromCurves = function createPathFromCurves(outer1, inner1, outer2, inner2) {
    var path = [];
    if (outer1 instanceof BezierCurve) {
        path.push(outer1.subdivide(0.5, false));
    } else {
        path.push(outer1);
    }

    if (outer2 instanceof BezierCurve) {
        path.push(outer2.subdivide(0.5, true));
    } else {
        path.push(outer2);
    }

    if (inner2 instanceof BezierCurve) {
        path.push(inner2.subdivide(0.5, true).reverse());
    } else {
        path.push(inner2);
    }

    if (inner1 instanceof BezierCurve) {
        path.push(inner1.subdivide(0.5, false).reverse());
    } else {
        path.push(inner1);
    }

    return path;
};

var calculateBorderBoxPath = function calculateBorderBoxPath(curves) {
    return [curves.topLeftOuter, curves.topRightOuter, curves.bottomRightOuter, curves.bottomLeftOuter];
};

var calculatePaddingBoxPath = function calculatePaddingBoxPath(curves) {
    return [curves.topLeftInner, curves.topRightInner, curves.bottomRightInner, curves.bottomLeftInner];
};

var parseBoundCurves = function parseBoundCurves(bounds, borders, borderRadius) {
    var HALF_WIDTH = bounds.width / 2;
    var HALF_HEIGHT = bounds.height / 2;
    var tlh = borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    var tlv = borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    var trh = borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.TOP_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    var trv = borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.TOP_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    var brh = borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_RIGHT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    var brv = borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_RIGHT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;
    var blh = borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) < HALF_WIDTH ? borderRadius[CORNER.BOTTOM_LEFT][H].getAbsoluteValue(bounds.width) : HALF_WIDTH;
    var blv = borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) < HALF_HEIGHT ? borderRadius[CORNER.BOTTOM_LEFT][V].getAbsoluteValue(bounds.height) : HALF_HEIGHT;

    var topWidth = bounds.width - trh;
    var rightHeight = bounds.height - brv;
    var bottomWidth = bounds.width - brh;
    var leftHeight = bounds.height - blv;

    return {
        topLeftOuter: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT) : new Vector(bounds.left, bounds.top),
        topLeftInner: tlh > 0 || tlv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth, Math.max(0, tlh - borders[LEFT].borderWidth), Math.max(0, tlv - borders[TOP].borderWidth), CORNER.TOP_LEFT) : new Vector(bounds.left + borders[LEFT].borderWidth, bounds.top + borders[TOP].borderWidth),
        topRightOuter: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top),
        topRightInner: trh > 0 || trv > 0 ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borders[LEFT].borderWidth), bounds.top + borders[TOP].borderWidth, topWidth > bounds.width + borders[LEFT].borderWidth ? 0 : trh - borders[LEFT].borderWidth, trv - borders[TOP].borderWidth, CORNER.TOP_RIGHT) : new Vector(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + borders[TOP].borderWidth),
        bottomRightOuter: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
        bottomRightInner: brh > 0 || brv > 0 ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borders[LEFT].borderWidth), bounds.top + Math.min(rightHeight, bounds.height + borders[TOP].borderWidth), Math.max(0, brh - borders[RIGHT].borderWidth), brv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_RIGHT) : new Vector(bounds.left + bounds.width - borders[RIGHT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth),
        bottomLeftOuter: blh > 0 || blv > 0 ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT) : new Vector(bounds.left, bounds.top + bounds.height),
        bottomLeftInner: blh > 0 || blv > 0 ? getCurvePoints(bounds.left + borders[LEFT].borderWidth, bounds.top + leftHeight, Math.max(0, blh - borders[LEFT].borderWidth), blv - borders[BOTTOM].borderWidth, CORNER.BOTTOM_LEFT) : new Vector(bounds.left + borders[LEFT].borderWidth, bounds.top + bounds.height - borders[BOTTOM].borderWidth)
    };
};

var CORNER = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3
};

var getCurvePoints = function getCurvePoints(x, y, r1, r2, position) {
    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    var ox = r1 * kappa; // control point offset horizontal
    var oy = r2 * kappa; // control point offset vertical
    var xm = x + r1; // x-middle
    var ym = y + r2; // y-middle

    switch (position) {
        case CORNER.TOP_LEFT:
            return new BezierCurve(new Vector(x, ym), new Vector(x, ym - oy), new Vector(xm - ox, y), new Vector(xm, y));
        case CORNER.TOP_RIGHT:
            return new BezierCurve(new Vector(x, y), new Vector(x + ox, y), new Vector(xm, ym - oy), new Vector(xm, ym));
        case CORNER.BOTTOM_RIGHT:
            return new BezierCurve(new Vector(xm, y), new Vector(xm, y + oy), new Vector(x + ox, ym), new Vector(x, ym));
        case CORNER.BOTTOM_LEFT:
        default:
            return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x, y + oy), new Vector(x, y));
    }
};

'use strict';

var BACKGROUND_REPEAT = {
    REPEAT: 0,
    NO_REPEAT: 1,
    REPEAT_X: 2,
    REPEAT_Y: 3
};

var BACKGROUND_SIZE = {
    AUTO: 0,
    CONTAIN: 1,
    COVER: 2,
    LENGTH: 3
};

var BACKGROUND_CLIP = {
    BORDER_BOX: 0,
    PADDING_BOX: 1,
    CONTENT_BOX: 2
};

var BACKGROUND_ORIGIN = BACKGROUND_CLIP;

var AUTO = 'auto';

var BackgroundSize = function BackgroundSize(size) {
    _classCallCheck(this, BackgroundSize);

    switch (size) {
        case 'contain':
            this.size = BACKGROUND_SIZE.CONTAIN;
            break;
        case 'cover':
            this.size = BACKGROUND_SIZE.COVER;
            break;
        case 'auto':
            this.size = BACKGROUND_SIZE.AUTO;
            break;
        default:
            this.value = new Length(size);
    }
};

var calculateBackgroundSize = function calculateBackgroundSize(backgroundImage, image, bounds) {
    var width = 0;
    var height = 0;
    var size = backgroundImage.size;
    if (size[0].size === BACKGROUND_SIZE.CONTAIN || size[0].size === BACKGROUND_SIZE.COVER) {
        var targetRatio = bounds.width / bounds.height;
        var currentRatio = image.width / image.height;
        return targetRatio < currentRatio !== (size[0].size === BACKGROUND_SIZE.COVER) ? new Size(bounds.width, bounds.width / currentRatio) : new Size(bounds.height * currentRatio, bounds.height);
    }

    if (size[0].value) {
        width = size[0].value.getAbsoluteValue(bounds.width);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO && size[1].size === BACKGROUND_SIZE.AUTO) {
        height = image.height;
    } else if (size[1].size === BACKGROUND_SIZE.AUTO) {
        height = width / image.width * image.height;
    } else if (size[1].value) {
        height = size[1].value.getAbsoluteValue(bounds.height);
    }

    if (size[0].size === BACKGROUND_SIZE.AUTO) {
        width = height / image.height * image.width;
    }

    return new Size(width, height);
};

var AUTO_SIZE = new BackgroundSize(AUTO);

var calculateBackgroungPaintingArea = function calculateBackgroungPaintingArea(curves, clip) {
    // TODO support CONTENT_BOX
    switch (clip) {
        case BACKGROUND_CLIP.BORDER_BOX:
            return calculateBorderBoxPath(curves);
        case BACKGROUND_CLIP.PADDING_BOX:
        default:
            return calculatePaddingBoxPath(curves);
    }
};

var calculateBackgroundPosition = function calculateBackgroundPosition(position, size, bounds) {
    return new Vector(position[0].getAbsoluteValue(bounds.width - size.width), position[1].getAbsoluteValue(bounds.height - size.height));
};

var calculateBackgroundRepeatPath = function calculateBackgroundRepeatPath(background, position, size, backgroundPositioningArea, bounds) {
    var repeat = background.repeat;
    switch (repeat) {
        case BACKGROUND_REPEAT.REPEAT_X:
            return [new Vector(Math.round(bounds.left), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left + bounds.width), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left + bounds.width), Math.round(size.height + backgroundPositioningArea.top + position.y)), new Vector(Math.round(bounds.left), Math.round(size.height + backgroundPositioningArea.top + position.y))];
        case BACKGROUND_REPEAT.REPEAT_Y:
            return [new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(bounds.height + bounds.top)), new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(bounds.height + bounds.top))];
        case BACKGROUND_REPEAT.NO_REPEAT:
            return [new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y)), new Vector(Math.round(backgroundPositioningArea.left + position.x + size.width), Math.round(backgroundPositioningArea.top + position.y + size.height)), new Vector(Math.round(backgroundPositioningArea.left + position.x), Math.round(backgroundPositioningArea.top + position.y + size.height))];
        default:
            return [new Vector(Math.round(bounds.left), Math.round(bounds.top)), new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.top)), new Vector(Math.round(bounds.left + bounds.width), Math.round(bounds.height + bounds.top)), new Vector(Math.round(bounds.left), Math.round(bounds.height + bounds.top))];
    }
};

var parseBackground = function parseBackground(style, imageLoader) {
    return {
        backgroundColor: new Color(style.backgroundColor),
        backgroundImage: parseBackgroundImages(style, imageLoader),
        backgroundClip: parseBackgroundClip(style.backgroundClip),
        backgroundOrigin: parseBackgroundOrigin(style.backgroundOrigin)
    };
};

var parseBackgroundClip = function parseBackgroundClip(backgroundClip) {
    switch (backgroundClip) {
        case 'padding-box':
            return BACKGROUND_CLIP.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_CLIP.CONTENT_BOX;
    }
    return BACKGROUND_CLIP.BORDER_BOX;
};

var parseBackgroundOrigin = function parseBackgroundOrigin(backgroundOrigin) {
    switch (backgroundOrigin) {
        case 'padding-box':
            return BACKGROUND_ORIGIN.PADDING_BOX;
        case 'content-box':
            return BACKGROUND_ORIGIN.CONTENT_BOX;
    }
    return BACKGROUND_ORIGIN.BORDER_BOX;
};

var parseBackgroundRepeat = function parseBackgroundRepeat(backgroundRepeat) {
    switch (backgroundRepeat.trim()) {
        case 'no-repeat':
            return BACKGROUND_REPEAT.NO_REPEAT;
        case 'repeat-x':
        case 'repeat no-repeat':
            return BACKGROUND_REPEAT.REPEAT_X;
        case 'repeat-y':
        case 'no-repeat repeat':
            return BACKGROUND_REPEAT.REPEAT_Y;
        case 'repeat':
            return BACKGROUND_REPEAT.REPEAT;
    }

    return BACKGROUND_REPEAT.REPEAT;
};

var parseBackgroundImages = function parseBackgroundImages(style, imageLoader) {
    var sources = parseBackgroundImage(style.backgroundImage).map(function (backgroundImage) {
        if (backgroundImage.method === 'url') {
            var key = imageLoader.loadImage(backgroundImage.args[0]);
            backgroundImage.args = key ? [key] : [];
        }
        return backgroundImage;
    });
    var positions = style.backgroundPosition.split(',');
    var repeats = style.backgroundRepeat.split(',');
    var sizes = style.backgroundSize.split(',');

    return sources.map(function (source, index) {
        var size = (sizes[index] || AUTO).trim().split(' ').map(parseBackgroundSize);
        var position = (positions[index] || AUTO).trim().split(' ').map(parseBackgoundPosition);

        return {
            source: source,
            repeat: parseBackgroundRepeat(typeof repeats[index] === 'string' ? repeats[index] : repeats[0]),
            size: size.length < 2 ? [size[0], AUTO_SIZE] : [size[0], size[1]],
            position: position.length < 2 ? [position[0], position[0]] : [position[0], position[1]]
        };
    });
};

var parseBackgroundSize = function parseBackgroundSize(size) {
    return size === 'auto' ? AUTO_SIZE : new BackgroundSize(size);
};

var parseBackgoundPosition = function parseBackgoundPosition(position) {
    switch (position) {
        case 'bottom':
        case 'right':
            return new Length('100%');
        case 'left':
        case 'top':
            return new Length('0%');
        case 'auto':
            return new Length('0');
    }
    return new Length(position);
};

var parseBackgroundImage = function parseBackgroundImage(image) {
    var whitespace = /^\s$/;
    var results = [];

    var args = [];
    var method = '';
    var quote = null;
    var definition = '';
    var mode = 0;
    var numParen = 0;

    var appendResult = function appendResult() {
        var prefix = '';
        if (method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }

            if (definition) {
                args.push(definition.trim());
            }

            var prefix_i = method.indexOf('-', 1) + 1;
            if (method.substr(0, 1) === '-' && prefix_i > 0) {
                prefix = method.substr(0, prefix_i).toLowerCase();
                method = method.substr(prefix_i);
            }
            method = method.toLowerCase();
            if (method !== 'none') {
                results.push({
                    prefix: prefix,
                    method: method,
                    args: args
                });
            }
        }
        args = [];
        method = definition = '';
    };

    image.split('').forEach(function (c) {
        if (mode === 0 && whitespace.test(c)) {
            return;
        }
        switch (c) {
            case '"':
                if (!quote) {
                    quote = c;
                } else if (quote === c) {
                    quote = null;
                }
                break;
            case '(':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    mode = 1;
                    return;
                } else {
                    numParen++;
                }
                break;
            case ')':
                if (quote) {
                    break;
                } else if (mode === 1) {
                    if (numParen === 0) {
                        mode = 0;
                        appendResult();
                        return;
                    } else {
                        numParen--;
                    }
                }
                break;

            case ',':
                if (quote) {
                    break;
                } else if (mode === 0) {
                    appendResult();
                    return;
                } else if (mode === 1) {
                    if (numParen === 0 && !method.match(/^url$/i)) {
                        args.push(definition.trim());
                        definition = '';
                        return;
                    }
                }
                break;
        }

        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();
    return results;
};

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys$1 = _core.Object.keys;

var keys = createCommonjsModule(function (module) {
module.exports = { "default": keys$1, __esModule: true };
});

var _Object$keys = unwrapExports(keys);

'use strict';

var BORDER_STYLE = {
    NONE: 0,
    SOLID: 1
};

var BORDER_SIDES = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3
};

var SIDES = _Object$keys(BORDER_SIDES).map(function (s) {
    return s.toLowerCase();
});

var parseBorderStyle = function parseBorderStyle(style) {
    switch (style) {
        case 'none':
            return BORDER_STYLE.NONE;
    }
    return BORDER_STYLE.SOLID;
};

var parseBorder = function parseBorder(style) {
    return SIDES.map(function (side) {
        var borderColor = new Color(style.getPropertyValue('border-' + side + '-color'));
        var borderStyle = parseBorderStyle(style.getPropertyValue('border-' + side + '-style'));
        var borderWidth = parseFloat(style.getPropertyValue('border-' + side + '-width'));
        return {
            borderColor: borderColor,
            borderStyle: borderStyle,
            borderWidth: isNaN(borderWidth) ? 0 : borderWidth
        };
    });
};

'use strict';

var SIDES$1 = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

var parseBorderRadius = function parseBorderRadius(style) {
    return SIDES$1.map(function (side) {
        var value = style.getPropertyValue('border-' + side + '-radius');

        var _value$split$map = value.split(' ').map(Length.create),
            _value$split$map2 = _slicedToArray(_value$split$map, 2),
            horizontal = _value$split$map2[0],
            vertical = _value$split$map2[1];

        return typeof vertical === 'undefined' ? [horizontal, horizontal] : [horizontal, vertical];
    });
};

'use strict';

var DISPLAY = {
    NONE: 1 << 0,
    BLOCK: 1 << 1,
    INLINE: 1 << 2,
    RUN_IN: 1 << 3,
    FLOW: 1 << 4,
    FLOW_ROOT: 1 << 5,
    TABLE: 1 << 6,
    FLEX: 1 << 7,
    GRID: 1 << 8,
    RUBY: 1 << 9,
    SUBGRID: 1 << 10,
    LIST_ITEM: 1 << 11,
    TABLE_ROW_GROUP: 1 << 12,
    TABLE_HEADER_GROUP: 1 << 13,
    TABLE_FOOTER_GROUP: 1 << 14,
    TABLE_ROW: 1 << 15,
    TABLE_CELL: 1 << 16,
    TABLE_COLUMN_GROUP: 1 << 17,
    TABLE_COLUMN: 1 << 18,
    TABLE_CAPTION: 1 << 19,
    RUBY_BASE: 1 << 20,
    RUBY_TEXT: 1 << 21,
    RUBY_BASE_CONTAINER: 1 << 22,
    RUBY_TEXT_CONTAINER: 1 << 23,
    CONTENTS: 1 << 24,
    INLINE_BLOCK: 1 << 25,
    INLINE_LIST_ITEM: 1 << 26,
    INLINE_TABLE: 1 << 27,
    INLINE_FLEX: 1 << 28,
    INLINE_GRID: 1 << 29
};

var parseDisplayValue = function parseDisplayValue(display) {
    switch (display) {
        case 'block':
            return DISPLAY.BLOCK;
        case 'inline':
            return DISPLAY.INLINE;
        case 'run-in':
            return DISPLAY.RUN_IN;
        case 'flow':
            return DISPLAY.FLOW;
        case 'flow-root':
            return DISPLAY.FLOW_ROOT;
        case 'table':
            return DISPLAY.TABLE;
        case 'flex':
            return DISPLAY.FLEX;
        case 'grid':
            return DISPLAY.GRID;
        case 'ruby':
            return DISPLAY.RUBY;
        case 'subgrid':
            return DISPLAY.SUBGRID;
        case 'list-item':
            return DISPLAY.LIST_ITEM;
        case 'table-row-group':
            return DISPLAY.TABLE_ROW_GROUP;
        case 'table-header-group':
            return DISPLAY.TABLE_HEADER_GROUP;
        case 'table-footer-group':
            return DISPLAY.TABLE_FOOTER_GROUP;
        case 'table-row':
            return DISPLAY.TABLE_ROW;
        case 'table-cell':
            return DISPLAY.TABLE_CELL;
        case 'table-column-group':
            return DISPLAY.TABLE_COLUMN_GROUP;
        case 'table-column':
            return DISPLAY.TABLE_COLUMN;
        case 'table-caption':
            return DISPLAY.TABLE_CAPTION;
        case 'ruby-base':
            return DISPLAY.RUBY_BASE;
        case 'ruby-text':
            return DISPLAY.RUBY_TEXT;
        case 'ruby-base-container':
            return DISPLAY.RUBY_BASE_CONTAINER;
        case 'ruby-text-container':
            return DISPLAY.RUBY_TEXT_CONTAINER;
        case 'contents':
            return DISPLAY.CONTENTS;
        case 'inline-block':
            return DISPLAY.INLINE_BLOCK;
        case 'inline-list-item':
            return DISPLAY.INLINE_LIST_ITEM;
        case 'inline-table':
            return DISPLAY.INLINE_TABLE;
        case 'inline-flex':
            return DISPLAY.INLINE_FLEX;
        case 'inline-grid':
            return DISPLAY.INLINE_GRID;
    }

    return DISPLAY.NONE;
};

var setDisplayBit = function setDisplayBit(bit, display) {
    return bit | parseDisplayValue(display);
};

var parseDisplay = function parseDisplay(display) {
    return display.split(' ').reduce(setDisplayBit, 0);
};

'use strict';

var FLOAT = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    INLINE_START: 3,
    INLINE_END: 4
};

var parseCSSFloat = function parseCSSFloat(float) {
    switch (float) {
        case 'left':
            return FLOAT.LEFT;
        case 'right':
            return FLOAT.RIGHT;
        case 'inline-start':
            return FLOAT.INLINE_START;
        case 'inline-end':
            return FLOAT.INLINE_END;
    }
    return FLOAT.NONE;
};

'use strict';

var parseFontWeight = function parseFontWeight(weight) {
    switch (weight) {
        case 'normal':
            return 400;
        case 'bold':
            return 700;
    }

    var value = parseInt(weight, 10);
    return isNaN(value) ? 400 : value;
};

var parseFont = function parseFont(style) {
    var fontFamily = style.fontFamily;
    var fontSize = style.fontSize;
    var fontStyle = style.fontStyle;
    var fontVariant = style.fontVariant;
    var fontWeight = parseFontWeight(style.fontWeight);

    return {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontStyle: fontStyle,
        fontVariant: fontVariant,
        fontWeight: fontWeight
    };
};

'use strict';

var parseLetterSpacing = function parseLetterSpacing(letterSpacing) {
    if (letterSpacing === 'normal') {
        return 0;
    }
    var value = parseInt(letterSpacing, 10);
    return isNaN(value) ? 0 : value;
};

'use strict';

var OVERFLOW = {
    VISIBLE: 0,
    HIDDEN: 1,
    SCROLL: 2,
    AUTO: 3
};

var parseOverflow = function parseOverflow(overflow) {
    switch (overflow) {
        case 'hidden':
            return OVERFLOW.HIDDEN;
        case 'scroll':
            return OVERFLOW.SCROLL;
        case 'auto':
            return OVERFLOW.AUTO;
        case 'visible':
        default:
            return OVERFLOW.VISIBLE;
    }
};

'use strict';

var SIDES$2 = ['top', 'right', 'bottom', 'left'];

var parsePadding = function parsePadding(style) {
    return SIDES$2.map(function (side) {
        return new Length(style.getPropertyValue('padding-' + side));
    });
};

'use strict';

var POSITION = {
    STATIC: 0,
    RELATIVE: 1,
    ABSOLUTE: 2,
    FIXED: 3,
    STICKY: 4
};

var parsePosition = function parsePosition(position) {
    switch (position) {
        case 'relative':
            return POSITION.RELATIVE;
        case 'absolute':
            return POSITION.ABSOLUTE;
        case 'fixed':
            return POSITION.FIXED;
        case 'sticky':
            return POSITION.STICKY;
    }

    return POSITION.STATIC;
};

'use strict';

var NUMBER = /^([+-]|\d|\.)$/i;

var parseTextShadow = function parseTextShadow(textShadow) {
    if (textShadow === 'none' || typeof textShadow !== 'string') {
        return null;
    }

    var currentValue = '';
    var isLength = false;
    var values = [];
    var shadows = [];
    var numParens = 0;
    var color = null;

    var appendValue = function appendValue() {
        if (currentValue.length) {
            if (isLength) {
                values.push(parseFloat(currentValue));
            } else {
                color = new Color(currentValue);
            }
        }
        isLength = false;
        currentValue = '';
    };

    var appendShadow = function appendShadow() {
        if (values.length && color !== null) {
            shadows.push({
                color: color,
                offsetX: values[0] || 0,
                offsetY: values[1] || 0,
                blur: values[2] || 0
            });
        }
        values.splice(0, values.length);
        color = null;
    };

    for (var i = 0; i < textShadow.length; i++) {
        var c = textShadow[i];
        switch (c) {
            case '(':
                currentValue += c;
                numParens++;
                break;
            case ')':
                currentValue += c;
                numParens--;
                break;
            case ',':
                if (numParens === 0) {
                    appendValue();
                    appendShadow();
                } else {
                    currentValue += c;
                }
                break;
            case ' ':
                if (numParens === 0) {
                    appendValue();
                } else {
                    currentValue += c;
                }
                break;
            default:
                if (currentValue.length === 0 && NUMBER.test(c)) {
                    isLength = true;
                }
                currentValue += c;
        }
    }

    appendValue();
    appendShadow();

    if (shadows.length === 0) {
        return null;
    }

    return shadows;
};

'use strict';

var TEXT_TRANSFORM = {
    NONE: 0,
    LOWERCASE: 1,
    UPPERCASE: 2,
    CAPITALIZE: 3
};

var parseTextTransform = function parseTextTransform(textTransform) {
    switch (textTransform) {
        case 'uppercase':
            return TEXT_TRANSFORM.UPPERCASE;
        case 'lowercase':
            return TEXT_TRANSFORM.LOWERCASE;
        case 'capitalize':
            return TEXT_TRANSFORM.CAPITALIZE;
    }

    return TEXT_TRANSFORM.NONE;
};

'use strict';

var toFloat = function toFloat(s) {
    return parseFloat(s.trim());
};

var MATRIX = /(matrix|matrix3d)\((.+)\)/;

var parseTransform = function parseTransform(style) {
    var transform = parseTransformMatrix(style.transform || style.webkitTransform || style.mozTransform ||
    // $FlowFixMe
    style.msTransform ||
    // $FlowFixMe
    style.oTransform);
    if (transform === null) {
        return null;
    }

    return {
        transform: transform,
        transformOrigin: parseTransformOrigin(style.transformOrigin || style.webkitTransformOrigin || style.mozTransformOrigin ||
        // $FlowFixMe
        style.msTransformOrigin ||
        // $FlowFixMe
        style.oTransformOrigin)
    };
};

// $FlowFixMe
var parseTransformOrigin = function parseTransformOrigin(origin) {
    if (typeof origin !== 'string') {
        var v = new Length('0');
        return [v, v];
    }
    var values = origin.split(' ').map(Length.create);
    return [values[0], values[1]];
};

// $FlowFixMe
var parseTransformMatrix = function parseTransformMatrix(transform) {
    if (transform === 'none' || typeof transform !== 'string') {
        return null;
    }

    var match = transform.match(MATRIX);
    if (match) {
        if (match[1] === 'matrix') {
            var matrix = match[2].split(',').map(toFloat);
            return [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]];
        } else {
            var matrix3d = match[2].split(',').map(toFloat);
            return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
        }
    }
    return null;
};

'use strict';

var VISIBILITY = {
    VISIBLE: 0,
    HIDDEN: 1,
    COLLAPSE: 2
};

var parseVisibility = function parseVisibility(visibility) {
    switch (visibility) {
        case 'hidden':
            return VISIBILITY.HIDDEN;
        case 'collapse':
            return VISIBILITY.COLLAPSE;
        case 'visible':
        default:
            return VISIBILITY.VISIBLE;
    }
};

'use strict';

var parseZIndex = function parseZIndex(zIndex) {
    var auto = zIndex === 'auto';
    return {
        auto: auto,
        order: auto ? 0 : parseInt(zIndex, 10)
    };
};

'use strict';

/** Highest positive signed 32-bit float value */

var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'

/** Regular expressions */
var regexPunycode = /^xn--/;
var regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
var errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
	var result = [];
	var length = array.length;
	while (length--) {
		result[length] = fn(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
	var parts = string.split('@');
	var result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		string = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	string = string.replace(regexSeparators, '.');
	var labels = string.split('.');
	var encoded = map(labels, fn).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	var output = [];
	var counter = 0;
	var length = string.length;
	while (counter < length) {
		var value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			var extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) {
				// Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
var ucs2encode = function ucs2encode(array) {
	return String.fromCodePoint.apply(String, babelHelpers.toConsumableArray(array));
};

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
var basicToDigit = function basicToDigit(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
var digitToBasic = function digitToBasic(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
var adapt = function adapt(delta, numPoints, firstTime) {
	var k = 0;
	delta = firstTime ? floor$1(delta / damp) : delta >> 1;
	delta += floor$1(delta / numPoints);
	for (; /* no initialization */delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor$1(delta / baseMinusTMin);
	}
	return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
var decode = function decode(input) {
	// Don't use UCS-2.
	var output = [];
	var inputLength = input.length;
	var i = 0;
	var n = initialN;
	var bias = initialBias;

	// Handle the basic code points: var `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	var basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (var j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (var index = basic > 0 ? basic + 1 : 0; index < inputLength;) /* no final expression */{

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		var oldi = i;
		for (var w = 1, k = base;; /* no condition */k += base) {

			if (index >= inputLength) {
				error('invalid-input');
			}

			var digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base || digit > floor$1((maxInt - i) / w)) {
				error('overflow');
			}

			i += digit * w;
			var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

			if (digit < t) {
				break;
			}

			var baseMinusT = base - t;
			if (w > floor$1(maxInt / baseMinusT)) {
				error('overflow');
			}

			w *= baseMinusT;
		}

		var out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor$1(i / out) > maxInt - n) {
			error('overflow');
		}

		n += floor$1(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);
	}

	return String.fromCodePoint.apply(String, output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
var encode = function encode(input) {
	var output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	var inputLength = input.length;

	// Initialize the state.
	var n = initialN;
	var delta = 0;
	var bias = initialBias;

	// Handle the basic code points.
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var currentValue = _step.value;

			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var basicLength = output.length;
	var handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		var m = maxInt;
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var currentValue = _step2.value;

				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow.
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		var handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var currentValue = _step3.value;

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}
				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer.
					var q = delta;
					for (var k = base;; /* no condition */k += base) {
						var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
						if (q < t) {
							break;
						}
						var qMinusT = q - t;
						var baseMinusT = base - t;
						output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
						q = floor$1(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		++delta;
		++n;
	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
var toUnicode = function toUnicode(input) {
	return mapDomain(input, function (string) {
		return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
var toASCII = function toASCII(input) {
	return mapDomain(input, function (string) {
		return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
var punycode = {
	/**
  * A string representing the current Punycode.js version number.
  * @memberOf punycode
  * @type String
  */
	'version': '2.1.0',
	/**
  * An object of methods to convert from JavaScript's internal character
  * representation (UCS-2) to Unicode code points, and back.
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode
  * @type Object
  */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};

var punycode_1 = punycode;

var punycode_3 = punycode_1.ucs2;

var ForeignObjectRenderer = function () {
    function ForeignObjectRenderer(element) {
        _classCallCheck(this, ForeignObjectRenderer);

        this.element = element;
    }

    _createClass(ForeignObjectRenderer, [{
        key: 'render',
        value: function render(options) {
            var _this = this;

            this.options = options;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = Math.floor(options.bounds.width * options.scale);
            this.canvas.height = Math.floor(options.bounds.height * options.scale);
            this.canvas.style.width = options.bounds.width + 'px';
            this.canvas.style.height = options.bounds.height + 'px';
            this.ctx.scale(this.options.scale, this.options.scale);

            options.logger.log('ForeignObject renderer initialized with scale ' + this.options.scale);
            var svg = createForeignObjectSVG(options.bounds.width, options.bounds.height, this.element);

            return loadSerializedSVG(svg).then(function (img) {
                if (options.backgroundColor) {
                    _this.ctx.fillStyle = options.backgroundColor.toString();
                    _this.ctx.fillRect(0, 0, options.bounds.width, options.bounds.height);
                }
                _this.ctx.drawImage(img, 0, 0);
                return _this.canvas;
            });
        }
    }]);

    return ForeignObjectRenderer;
}();

var createForeignObjectSVG = function createForeignObjectSVG(width, height, node) {
    var xmlns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(xmlns, 'svg');
    var foreignObject = document.createElementNS(xmlns, 'foreignObject');
    svg.setAttributeNS(null, 'width', width);
    svg.setAttributeNS(null, 'height', height);

    foreignObject.setAttributeNS(null, 'width', '100%');
    foreignObject.setAttributeNS(null, 'height', '100%');
    foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
    svg.appendChild(foreignObject);

    foreignObject.appendChild(node);

    return svg;
};

var loadSerializedSVG = function loadSerializedSVG(svg) {
    return new _Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            return resolve(img);
        };
        img.onerror = reject;

        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
    });
};

'use strict';

var testRangeBounds = function testRangeBounds(document) {
    var TEST_HEIGHT = 123;

    if (document.createRange) {
        var range = document.createRange();
        if (range.getBoundingClientRect) {
            var testElement = document.createElement('boundtest');
            testElement.style.height = TEST_HEIGHT + 'px';
            testElement.style.display = 'block';
            document.body.appendChild(testElement);

            range.selectNode(testElement);
            var rangeBounds = range.getBoundingClientRect();
            var rangeHeight = Math.round(rangeBounds.height);
            document.body.removeChild(testElement);
            if (rangeHeight === TEST_HEIGHT) {
                return true;
            }
        }
    }

    return false;
};

// iOS 10.3 taints canvas with base64 images unless crossOrigin = 'anonymous'
var testBase64 = function testBase64(document, src) {
    var img = new Image();
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    return new _Promise(function (resolve) {
        // Single pixel base64 image renders fine on iOS 10.3???
        img.src = src;

        var onload = function onload() {
            try {
                ctx.drawImage(img, 0, 0);
                canvas.toDataURL();
            } catch (e) {
                return resolve(false);
            }

            return resolve(true);
        };

        img.onload = onload;
        img.onerror = function () {
            return resolve(false);
        };

        if (img.complete === true) {
            setTimeout(function () {
                onload();
            }, 500);
        }
    });
};

var testCORS = function testCORS() {
    return typeof new Image().crossOrigin !== 'undefined';
};

var testResponseType = function testResponseType() {
    return typeof new XMLHttpRequest().responseType === 'string';
};

var testSVG = function testSVG(document) {
    var img = new Image();
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    img.src = 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'></svg>';

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch (e) {
        return false;
    }
    return true;
};

var isGreenPixel = function isGreenPixel(data) {
    return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
};

var testForeignObject = function testForeignObject(document) {
    var canvas = document.createElement('canvas');
    var size = 100;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 0, size, size);

    var img = new Image();
    var greenImageSrc = canvas.toDataURL();
    img.src = greenImageSrc;
    var svg = createForeignObjectSVG(size, size, img);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, size, size);

    return loadSerializedSVG(svg).then(function (img) {
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, size, size).data;
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, size, size);

        var node = document.createElement('div');
        node.style.backgroundImage = 'url(' + greenImageSrc + ')';
        node.style.height = size + 'px';
        // Firefox 55 does not render inline <img /> tags
        return isGreenPixel(data) ? loadSerializedSVG(createForeignObjectSVG(size, size, node)) : _Promise.reject(false);
    }).then(function (img) {
        ctx.drawImage(img, 0, 0);
        // Edge does not render background-images
        return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
    }).catch(function (e) {
        return false;
    });
};

var FEATURES = {
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_RANGE_BOUNDS() {
        'use strict';

        var value = testRangeBounds(document);
        Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', { value: value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_SVG_DRAWING() {
        'use strict';

        var value = testSVG(document);
        Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', { value: value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_BASE64_DRAWING() {
        'use strict';

        return function (src) {
            var _value = testBase64(document, src);
            Object.defineProperty(FEATURES, 'SUPPORT_BASE64_DRAWING', { value: function value() {
                    return _value;
                } });
            return _value;
        };
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_FOREIGNOBJECT_DRAWING() {
        'use strict';

        var value = testForeignObject(document);
        Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', { value: value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_CORS_IMAGES() {
        'use strict';

        var value = testCORS();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', { value: value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_RESPONSE_TYPE() {
        'use strict';

        var value = testResponseType();
        Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', { value: value });
        return value;
    },
    // $FlowFixMe - get/set properties not yet supported
    get SUPPORT_CORS_XHR() {
        'use strict';

        var value = 'withCredentials' in new XMLHttpRequest();
        Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', { value: value });
        return value;
    }
};

'use strict';

var UNICODE = /[^\u0000-\u00ff]/;

var hasUnicodeCharacters = function hasUnicodeCharacters(text) {
    return UNICODE.test(text);
};

var encodeCodePoint = function encodeCodePoint(codePoint) {
    return punycode_3.encode([codePoint]);
};

var TextBounds = function TextBounds(text, bounds) {
    _classCallCheck(this, TextBounds);

    this.text = text;
    this.bounds = bounds;
};

var parseTextBounds = function parseTextBounds(value, parent, node) {
    var codePoints = punycode_3.decode(value);
    var letterRendering = parent.style.letterSpacing !== 0 || hasUnicodeCharacters(value);
    var textList = letterRendering ? codePoints.map(encodeCodePoint) : splitWords(codePoints);
    var length = textList.length;
    var textBounds = [];
    var offset = 0;
    for (var i = 0; i < length; i++) {
        var text = textList[i];
        if (parent.style.textDecoration !== TEXT_DECORATION.NONE || text.trim().length > 0) {
            if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
            } else {
                var replacementNode = node.splitText(text.length);
                textBounds.push(new TextBounds(text, getWrapperBounds(node)));
                node = replacementNode;
            }
        } else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
            node = node.splitText(text.length);
        }
        offset += text.length;
    }
    return textBounds;
};

var getWrapperBounds = function getWrapperBounds(node) {
    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    wrapper.appendChild(node.cloneNode(true));
    var parentNode = node.parentNode;
    if (parentNode) {
        parentNode.replaceChild(wrapper, node);
        var bounds = parseBounds(wrapper);
        if (wrapper.firstChild) {
            parentNode.replaceChild(wrapper.firstChild, wrapper);
        }
        return bounds;
    }
    return new Bounds(0, 0, 0, 0);
};

var getRangeBounds = function getRangeBounds(node, offset, length) {
    var range = node.ownerDocument.createRange();
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return Bounds.fromClientRect(range.getBoundingClientRect());
};

var splitWords = function splitWords(codePoints) {
    var words = [];
    var i = 0;
    var onWordBoundary = false;
    var word = void 0;
    while (codePoints.length) {
        if (isWordBoundary(codePoints[i]) === onWordBoundary) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(punycode_3.encode(word));
            }
            onWordBoundary = !onWordBoundary;
            i = 0;
        } else {
            i++;
        }

        if (i >= codePoints.length) {
            word = codePoints.splice(0, i);
            if (word.length) {
                words.push(punycode_3.encode(word));
            }
        }
    }
    return words;
};

var isWordBoundary = function isWordBoundary(characterCode) {
    return [32, // <space>
    13, // \r
    10, // \n
    9, // \t
    45 // -
    ].indexOf(characterCode) !== -1;
};

'use strict';

var TextContainer = function () {
    function TextContainer(text, parent, bounds) {
        _classCallCheck(this, TextContainer);

        this.text = text;
        this.parent = parent;
        this.bounds = bounds;
    }

    _createClass(TextContainer, null, [{
        key: 'fromTextNode',
        value: function fromTextNode(node, parent) {
            var text = transform(node.data, parent.style.textTransform);
            return new TextContainer(text, parent, parseTextBounds(text, parent, node));
        }
    }]);

    return TextContainer;
}();

var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;

var transform = function transform(text, _transform) {
    switch (_transform) {
        case TEXT_TRANSFORM.LOWERCASE:
            return text.toLowerCase();
        case TEXT_TRANSFORM.CAPITALIZE:
            return text.replace(CAPITALIZE, capitalize);
        case TEXT_TRANSFORM.UPPERCASE:
            return text.toUpperCase();
        default:
            return text;
    }
};

function capitalize(m, p1, p2) {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }

    return m;
}

'use strict';

var Circle = function Circle(x, y, radius) {
    _classCallCheck(this, Circle);

    this.type = PATH.CIRCLE;
    this.x = x;
    this.y = y;
    this.radius = radius;
    
};

'use strict';

var INPUT_COLOR = new Color([42, 42, 42]);
var INPUT_BORDER_COLOR = new Color([165, 165, 165]);
var INPUT_BACKGROUND_COLOR = new Color([222, 222, 222]);
var INPUT_BORDER = {
    borderWidth: 1,
    borderColor: INPUT_BORDER_COLOR,
    borderStyle: BORDER_STYLE.SOLID
};
var INPUT_BORDERS = [INPUT_BORDER, INPUT_BORDER, INPUT_BORDER, INPUT_BORDER];
var INPUT_BACKGROUND = {
    backgroundColor: INPUT_BACKGROUND_COLOR,
    backgroundImage: [],
    backgroundClip: BACKGROUND_CLIP.PADDING_BOX,
    backgroundOrigin: BACKGROUND_ORIGIN.PADDING_BOX
};

var RADIO_BORDER_RADIUS = new Length('50%');
var RADIO_BORDER_RADIUS_TUPLE = [RADIO_BORDER_RADIUS, RADIO_BORDER_RADIUS];
var INPUT_RADIO_BORDER_RADIUS = [RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE, RADIO_BORDER_RADIUS_TUPLE];

var CHECKBOX_BORDER_RADIUS = new Length('3px');
var CHECKBOX_BORDER_RADIUS_TUPLE = [CHECKBOX_BORDER_RADIUS, CHECKBOX_BORDER_RADIUS];
var INPUT_CHECKBOX_BORDER_RADIUS = [CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE, CHECKBOX_BORDER_RADIUS_TUPLE];

var getInputBorderRadius = function getInputBorderRadius(node) {
    return node.type === 'radio' ? INPUT_RADIO_BORDER_RADIUS : INPUT_CHECKBOX_BORDER_RADIUS;
};

var inlineInputElement = function inlineInputElement(node, container) {
    if (node.type === 'radio' || node.type === 'checkbox') {
        if (node.checked) {
            var size = Math.min(container.bounds.width, container.bounds.height);
            container.childNodes.push(node.type === 'checkbox' ? [new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79), new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549), new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071), new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649), new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23), new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085), new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)] : new Circle(container.bounds.left + size / 4, container.bounds.top + size / 4, size / 4));
        }
    } else {
        inlineFormElement(getInputValue(node), node, container, false);
    }
};

var inlineTextAreaElement = function inlineTextAreaElement(node, container) {
    inlineFormElement(node.value, node, container, true);
};

var inlineSelectElement = function inlineSelectElement(node, container) {
    var option = node.options[node.selectedIndex || 0];
    inlineFormElement(option ? option.text || '' : '', node, container, false);
};

var reformatInputBounds = function reformatInputBounds(bounds) {
    if (bounds.width > bounds.height) {
        bounds.left += (bounds.width - bounds.height) / 2;
        bounds.width = bounds.height;
    } else if (bounds.width < bounds.height) {
        bounds.top += (bounds.height - bounds.width) / 2;
        bounds.height = bounds.width;
    }
    return bounds;
};

var inlineFormElement = function inlineFormElement(value, node, container, allowLinebreak) {
    var body = node.ownerDocument.body;
    if (value.length > 0 && body) {
        var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
        copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node, null), wrapper);
        wrapper.style.position = 'fixed';
        wrapper.style.left = container.bounds.left + 'px';
        wrapper.style.top = container.bounds.top + 'px';
        if (!allowLinebreak) {
            wrapper.style.whiteSpace = 'nowrap';
        }
        var text = node.ownerDocument.createTextNode(value);
        wrapper.appendChild(text);
        body.appendChild(wrapper);
        container.childNodes.push(TextContainer.fromTextNode(text, container));
        body.removeChild(wrapper);
    }
};

var getInputValue = function getInputValue(node) {
    var value = node.type === 'password' ? new Array(node.value.length + 1).join('\u2022') : node.value;

    return value.length === 0 ? node.placeholder || '' : value;
};

'use strict';

var INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

var NodeContainer = function () {
    function NodeContainer(node, parent, imageLoader, index) {
        var _this = this;

        _classCallCheck(this, NodeContainer);

        this.parent = parent;
        this.index = index;
        this.childNodes = [];
        var defaultView = node.ownerDocument.defaultView;
        var style = defaultView.getComputedStyle(node, null);
        var display = parseDisplay(style.display);

        var IS_INPUT = node.type === 'radio' || node.type === 'checkbox';

        var position = parsePosition(style.position);

        this.style = {
            background: IS_INPUT ? INPUT_BACKGROUND : parseBackground(style, imageLoader),
            border: IS_INPUT ? INPUT_BORDERS : parseBorder(style),
            borderRadius: (node instanceof defaultView.HTMLInputElement || node instanceof HTMLInputElement) && IS_INPUT ? getInputBorderRadius(node) : parseBorderRadius(style),
            color: IS_INPUT ? INPUT_COLOR : new Color(style.color),
            display: display,
            float: parseCSSFloat(style.float),
            font: parseFont(style),
            letterSpacing: parseLetterSpacing(style.letterSpacing),
            opacity: parseFloat(style.opacity),
            overflow: INPUT_TAGS.indexOf(node.tagName) === -1 ? parseOverflow(style.overflow) : OVERFLOW.HIDDEN,
            padding: parsePadding(style),
            position: position,
            textDecoration: parseTextDecoration(style),
            textShadow: parseTextShadow(style.textShadow),
            textTransform: parseTextTransform(style.textTransform),
            transform: parseTransform(style),
            visibility: parseVisibility(style.visibility),
            zIndex: parseZIndex(position !== POSITION.STATIC ? style.zIndex : 'auto')
        };

        if (this.isTransformed()) {
            // getBoundingClientRect provides values post-transform, we want them without the transformation
            node.style.transform = 'matrix(1,0,0,1,0,0)';
        }

        // TODO move bound retrieval for all nodes to a later stage?
        if (node.tagName === 'IMG') {
            node.addEventListener('load', function () {
                _this.bounds = parseBounds(node);
                _this.curvedBounds = parseBoundCurves(_this.bounds, _this.style.border, _this.style.borderRadius);
            });
        }
        this.image = getImage(node, imageLoader);
        this.bounds = IS_INPUT ? reformatInputBounds(parseBounds(node)) : parseBounds(node);
        this.curvedBounds = parseBoundCurves(this.bounds, this.style.border, this.style.borderRadius);

        
    }

    _createClass(NodeContainer, [{
        key: 'getClipPaths',
        value: function getClipPaths() {
            var parentClips = this.parent ? this.parent.getClipPaths() : [];
            var isClipped = this.style.overflow === OVERFLOW.HIDDEN || this.style.overflow === OVERFLOW.SCROLL;

            return isClipped ? parentClips.concat([calculatePaddingBoxPath(this.curvedBounds)]) : parentClips;
        }
    }, {
        key: 'isInFlow',
        value: function isInFlow() {
            return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned();
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return !contains(this.style.display, DISPLAY.NONE) && this.style.opacity > 0 && this.style.visibility === VISIBILITY.VISIBLE;
        }
    }, {
        key: 'isAbsolutelyPositioned',
        value: function isAbsolutelyPositioned() {
            return this.style.position !== POSITION.STATIC && this.style.position !== POSITION.RELATIVE;
        }
    }, {
        key: 'isPositioned',
        value: function isPositioned() {
            return this.style.position !== POSITION.STATIC;
        }
    }, {
        key: 'isFloating',
        value: function isFloating() {
            return this.style.float !== FLOAT.NONE;
        }
    }, {
        key: 'isRootElement',
        value: function isRootElement() {
            return this.parent === null;
        }
    }, {
        key: 'isTransformed',
        value: function isTransformed() {
            return this.style.transform !== null;
        }
    }, {
        key: 'isPositionedWithZIndex',
        value: function isPositionedWithZIndex() {
            return this.isPositioned() && !this.style.zIndex.auto;
        }
    }, {
        key: 'isInlineLevel',
        value: function isInlineLevel() {
            return contains(this.style.display, DISPLAY.INLINE) || contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_FLEX) || contains(this.style.display, DISPLAY.INLINE_GRID) || contains(this.style.display, DISPLAY.INLINE_LIST_ITEM) || contains(this.style.display, DISPLAY.INLINE_TABLE);
        }
    }, {
        key: 'isInlineBlockOrInlineTable',
        value: function isInlineBlockOrInlineTable() {
            return contains(this.style.display, DISPLAY.INLINE_BLOCK) || contains(this.style.display, DISPLAY.INLINE_TABLE);
        }
    }]);

    return NodeContainer;
}();

var getImage = function getImage(node, imageLoader) {
    if (node instanceof node.ownerDocument.defaultView.SVGSVGElement || node instanceof SVGSVGElement) {
        var s = new XMLSerializer();
        return imageLoader.loadImage('data:image/svg+xml,' + encodeURIComponent(s.serializeToString(node)));
    }
    switch (node.tagName) {
        case 'IMG':
            // $FlowFixMe
            return imageLoader.loadImage(node.currentSrc || node.src);
        case 'CANVAS':
            // $FlowFixMe
            return imageLoader.loadCanvas(node);
        case 'DIV':
            var iframeKey = node.getAttribute('data-html2canvas-internal-iframe-key');
            if (iframeKey) {
                console.log('ok');
                return iframeKey;
            }
            break;
    }

    return null;
};

'use strict';

var StackingContext = function () {
    function StackingContext(container, parent, treatAsRealStackingContext) {
        _classCallCheck(this, StackingContext);

        this.container = container;
        this.parent = parent;
        this.contexts = [];
        this.children = [];
        this.treatAsRealStackingContext = treatAsRealStackingContext;
    }

    _createClass(StackingContext, [{
        key: 'getOpacity',
        value: function getOpacity() {
            return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity;
        }
    }, {
        key: 'getRealParentStackingContext',
        value: function getRealParentStackingContext() {
            return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext();
        }
    }]);

    return StackingContext;
}();

'use strict';

var NodeParser = function NodeParser(node, imageLoader, logger) {
    var index = 0;

    var container = new NodeContainer(node, null, imageLoader, index++);
    var stack = new StackingContext(container, null, true);

    parseNodeTree(node, container, stack, imageLoader, index);

    return stack;
};

var IGNORED_NODE_NAMES = ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'];

var parseNodeTree = function parseNodeTree(node, parent, stack, imageLoader, index) {
    if (false && index > 50000) {
        throw new Error('Recursion error while parsing node tree');
    }

    for (var childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;
        var defaultView = childNode.ownerDocument.defaultView;
        if (childNode instanceof defaultView.Text || childNode instanceof Text) {
            if (childNode.data.trim().length > 0) {
                parent.childNodes.push(TextContainer.fromTextNode(childNode, parent));
            }
        } else if (childNode instanceof defaultView.HTMLElement || childNode instanceof HTMLElement) {
            if (IGNORED_NODE_NAMES.indexOf(childNode.nodeName) === -1) {
                var container = new NodeContainer(childNode, parent, imageLoader, index++);
                if (container.isVisible()) {
                    if (childNode.tagName === 'INPUT') {
                        // $FlowFixMe
                        inlineInputElement(childNode, container);
                    } else if (childNode.tagName === 'TEXTAREA') {
                        // $FlowFixMe
                        inlineTextAreaElement(childNode, container);
                    } else if (childNode.tagName === 'SELECT') {
                        // $FlowFixMe
                        inlineSelectElement(childNode, container);
                    }

                    var SHOULD_TRAVERSE_CHILDREN = childNode.tagName !== 'TEXTAREA';
                    var treatAsRealStackingContext = createsRealStackingContext(container, childNode);
                    if (treatAsRealStackingContext || createsStackingContext(container)) {
                        // for treatAsRealStackingContext:false, any positioned descendants and descendants
                        // which actually create a new stacking context should be considered part of the parent stacking context
                        var parentStack = treatAsRealStackingContext || container.isPositioned() ? stack.getRealParentStackingContext() : stack;
                        var childStack = new StackingContext(container, parentStack, treatAsRealStackingContext);
                        parentStack.contexts.push(childStack);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, childStack, imageLoader, index);
                        }
                    } else {
                        stack.children.push(container);
                        if (SHOULD_TRAVERSE_CHILDREN) {
                            parseNodeTree(childNode, container, stack, imageLoader, index);
                        }
                    }
                }
            }
        } else if (childNode instanceof defaultView.SVGSVGElement || childNode instanceof SVGSVGElement) {
            var _container = new NodeContainer(childNode, parent, imageLoader, index++);
            var _treatAsRealStackingContext = createsRealStackingContext(_container, childNode);
            if (_treatAsRealStackingContext || createsStackingContext(_container)) {
                // for treatAsRealStackingContext:false, any positioned descendants and descendants
                // which actually create a new stacking context should be considered part of the parent stacking context
                var _parentStack = _treatAsRealStackingContext || _container.isPositioned() ? stack.getRealParentStackingContext() : stack;
                var _childStack = new StackingContext(_container, _parentStack, _treatAsRealStackingContext);
                _parentStack.contexts.push(_childStack);
            } else {
                stack.children.push(_container);
            }
        }
    }
};

var createsRealStackingContext = function createsRealStackingContext(container, node) {
    return container.isRootElement() || container.isPositionedWithZIndex() || container.style.opacity < 1 || container.isTransformed() || isBodyWithTransparentRoot(container, node);
};

var createsStackingContext = function createsStackingContext(container) {
    return container.isPositioned() || container.isFloating();
};

var isBodyWithTransparentRoot = function isBodyWithTransparentRoot(container, node) {
    return node.nodeName === 'BODY' && container.parent instanceof NodeContainer && container.parent.style.background.backgroundColor.isTransparent();
};

'use strict';

var SAMPLE_TEXT = 'Hidden Text';
var FontMetrics = function () {
    function FontMetrics(document) {
        _classCallCheck(this, FontMetrics);

        this._data = {};
        this._document = document;
    }

    _createClass(FontMetrics, [{
        key: '_parseMetrics',
        value: function _parseMetrics(font) {
            var container = this._document.createElement('div');
            var img = this._document.createElement('img');
            var span = this._document.createElement('span');

            var body = this._document.body;
            if (!body) {
                throw new Error('');
            }

            container.style.visibility = 'hidden';
            container.style.fontFamily = font.fontFamily;
            container.style.fontSize = font.fontSize;
            container.style.margin = '0';
            container.style.padding = '0';

            body.appendChild(container);

            img.src = SMALL_IMAGE;
            img.width = 1;
            img.height = 1;

            img.style.margin = '0';
            img.style.padding = '0';
            img.style.verticalAlign = 'baseline';

            span.style.fontFamily = font.fontFamily;
            span.style.fontSize = font.fontSize;
            span.style.margin = '0';
            span.style.padding = '0';

            span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
            container.appendChild(span);
            container.appendChild(img);
            var baseline = img.offsetTop - span.offsetTop + 2;

            container.removeChild(span);
            container.appendChild(this._document.createTextNode(SAMPLE_TEXT));

            container.style.lineHeight = 'normal';
            img.style.verticalAlign = 'super';

            var middle = img.offsetTop - container.offsetTop + 2;

            body.removeChild(container);

            return { baseline: baseline, middle: middle };
        }
    }, {
        key: 'getMetrics',
        value: function getMetrics(font) {
            if (this._data[font.fontFamily + ' ' + font.fontSize] === undefined) {
                this._data[font.fontFamily + ' ' + font.fontSize] = this._parseMetrics(font);
            }
            return this._data[font.fontFamily + ' ' + font.fontSize];
        }
    }]);

    return FontMetrics;
}();

'use strict';

var ANGLE = /([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;

var parseAngle = function parseAngle(angle) {
    var match = angle.match(ANGLE);

    if (match) {
        var value = parseFloat(match[1]);
        switch (match[2].toLowerCase()) {
            case 'deg':
                return Math.PI * value / 180;
            case 'grad':
                return Math.PI / 200 * value;
            case 'rad':
                return value;
            case 'turn':
                return Math.PI * 2 * value;
        }
    }

    return null;
};

'use strict';

var SIDE_OR_CORNER = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i;
var PERCENTAGE_ANGLES = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i;
var ENDS_WITH_LENGTH = /(px)|%|( 0)$/i;
var FROM_TO = /^(from|to)\((.+)\)$/i;

var parseGradient = function parseGradient(_ref, bounds) {
    var args = _ref.args,
        method = _ref.method;

    if (method === 'linear-gradient') {
        return parseLinearGradient(args, bounds);
    } else if (method === 'gradient' && args[0] === 'linear') {
        // TODO handle correct angle
        return parseLinearGradient(['to bottom'].concat(args.slice(3).map(function (color) {
            return color.match(FROM_TO);
        }).filter(function (v) {
            return v !== null;
        })
        // $FlowFixMe
        .map(function (v) {
            return v[2];
        })), bounds);
    }
};

var parseLinearGradient = function parseLinearGradient(args, bounds) {
    var angle = parseAngle(args[0]);
    var HAS_SIDE_OR_CORNER = SIDE_OR_CORNER.test(args[0]);
    var HAS_DIRECTION = HAS_SIDE_OR_CORNER || angle !== null || PERCENTAGE_ANGLES.test(args[0]);
    var direction = HAS_DIRECTION ? angle !== null ? calculateGradientDirection(angle, bounds) : HAS_SIDE_OR_CORNER ? parseSideOrCorner(args[0], bounds) : parsePercentageAngle(args[0], bounds) : calculateGradientDirection(Math.PI, bounds);
    var colorStops = [];
    var firstColorStopIndex = HAS_DIRECTION ? 1 : 0;

    for (var i = firstColorStopIndex; i < args.length; i++) {
        var value = args[i];
        var HAS_LENGTH = ENDS_WITH_LENGTH.test(value);
        var lastSpaceIndex = value.lastIndexOf(' ');
        var _color = new Color(HAS_LENGTH ? value.substring(0, lastSpaceIndex) : value);
        var _stop = HAS_LENGTH ? new Length(value.substring(lastSpaceIndex + 1)) : i === firstColorStopIndex ? new Length('0%') : i === args.length - 1 ? new Length('100%') : null;
        colorStops.push({ color: _color, stop: _stop });
    }

    // TODO: Fix some inaccuracy with color stops with px values
    var lineLength = Math.min(Math.sqrt(Math.pow(Math.abs(direction.x0) + Math.abs(direction.x1), 2) + Math.pow(Math.abs(direction.y0) + Math.abs(direction.y1), 2)), bounds.width * 2, bounds.height * 2);

    var absoluteValuedColorStops = colorStops.map(function (_ref2) {
        var color = _ref2.color,
            stop = _ref2.stop;

        return {
            color: color,
            // $FlowFixMe
            stop: stop ? stop.getAbsoluteValue(lineLength) / lineLength : null
        };
    });

    var previousColorStop = absoluteValuedColorStops[0].stop;
    for (var _i = 0; _i < absoluteValuedColorStops.length; _i++) {
        if (previousColorStop !== null) {
            var _stop2 = absoluteValuedColorStops[_i].stop;
            if (_stop2 === null) {
                var n = _i;
                while (absoluteValuedColorStops[n].stop === null) {
                    n++;
                }
                var steps = n - _i + 1;
                var nextColorStep = absoluteValuedColorStops[n].stop;
                var stepSize = (nextColorStep - previousColorStop) / steps;
                for (; _i < n; _i++) {
                    previousColorStop = absoluteValuedColorStops[_i].stop = previousColorStop + stepSize;
                }
            } else {
                previousColorStop = _stop2;
            }
        }
    }

    return {
        direction: direction,
        colorStops: absoluteValuedColorStops
    };
};

var calculateGradientDirection = function calculateGradientDirection(radian, bounds) {
    var width = bounds.width;
    var height = bounds.height;
    var HALF_WIDTH = width * 0.5;
    var HALF_HEIGHT = height * 0.5;
    var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
    var HALF_LINE_LENGTH = lineLength / 2;

    var x0 = HALF_WIDTH + Math.sin(radian) * HALF_LINE_LENGTH;
    var y0 = HALF_HEIGHT - Math.cos(radian) * HALF_LINE_LENGTH;
    var x1 = width - x0;
    var y1 = height - y0;

    return { x0: x0, x1: x1, y0: y0, y1: y1 };
};

var parseTopRight = function parseTopRight(bounds) {
    return Math.acos(bounds.width / 2 / (Math.sqrt(Math.pow(bounds.width, 2) + Math.pow(bounds.height, 2)) / 2));
};

var parseSideOrCorner = function parseSideOrCorner(side, bounds) {
    switch (side) {
        case 'bottom':
        case 'to top':
            return calculateGradientDirection(0, bounds);
        case 'left':
        case 'to right':
            return calculateGradientDirection(Math.PI / 2, bounds);
        case 'right':
        case 'to left':
            return calculateGradientDirection(3 * Math.PI / 2, bounds);
        case 'top right':
        case 'right top':
        case 'to bottom left':
        case 'to left bottom':
            return calculateGradientDirection(Math.PI + parseTopRight(bounds), bounds);
        case 'top left':
        case 'left top':
        case 'to bottom right':
        case 'to right bottom':
            return calculateGradientDirection(Math.PI - parseTopRight(bounds), bounds);
        case 'bottom left':
        case 'left bottom':
        case 'to top right':
        case 'to right top':
            return calculateGradientDirection(parseTopRight(bounds), bounds);
        case 'bottom right':
        case 'right bottom':
        case 'to top left':
        case 'to left top':
            return calculateGradientDirection(2 * Math.PI - parseTopRight(bounds), bounds);
        case 'top':
        case 'to bottom':
        default:
            return calculateGradientDirection(Math.PI, bounds);
    }
};

var parsePercentageAngle = function parsePercentageAngle(angle, bounds) {
    var _angle$split$map = angle.split(' ').map(parseFloat),
        _angle$split$map2 = _slicedToArray(_angle$split$map, 2),
        left = _angle$split$map2[0],
        top = _angle$split$map2[1];

    var ratio = left / 100 * bounds.width / (top / 100 * bounds.height);

    return calculateGradientDirection(Math.atan(isNaN(ratio) ? 1 : ratio) + Math.PI / 2, bounds);
};

'use strict';

var Renderer = function () {
    function Renderer(target, options) {
        _classCallCheck(this, Renderer);

        this.target = target;
        this.options = options;
        target.render(options);
    }

    _createClass(Renderer, [{
        key: 'renderNode',
        value: function renderNode(container) {
            if (container.isVisible()) {
                this.renderNodeBackgroundAndBorders(container);
                this.renderNodeContent(container);
            }
        }
    }, {
        key: 'renderNodeContent',
        value: function renderNodeContent(container) {
            var _this = this;

            var callback = function callback() {
                if (container.childNodes.length) {
                    container.childNodes.forEach(function (child) {
                        if (child instanceof TextContainer) {
                            var style = child.parent.style;
                            _this.target.renderTextNode(child.bounds, style.color, style.font, style.textDecoration, style.textShadow);
                        } else {
                            _this.target.drawShape(child, container.style.color);
                        }
                    });
                }

                if (container.image) {
                    var _image = _this.options.imageStore.get(container.image);
                    if (_image) {
                        var contentBox = calculateContentBox(container.bounds, container.style.padding, container.style.border);
                        var _width = typeof _image.width === 'number' && _image.width > 0 ? _image.width : contentBox.width;
                        var _height = typeof _image.height === 'number' && _image.height > 0 ? _image.height : contentBox.height;
                        if (_width > 0 && _height > 0) {
                            _this.target.clip([calculatePaddingBoxPath(container.curvedBounds)], function () {
                                _this.target.drawImage(_image, new Bounds(0, 0, _width, _height), contentBox);
                            });
                        }
                    }
                }
            };
            var paths = container.getClipPaths();
            if (paths.length) {
                this.target.clip(paths, callback);
            } else {
                callback();
            }
        }
    }, {
        key: 'renderNodeBackgroundAndBorders',
        value: function renderNodeBackgroundAndBorders(container) {
            var _this2 = this;

            var HAS_BACKGROUND = !container.style.background.backgroundColor.isTransparent() || container.style.background.backgroundImage.length;

            var renderableBorders = container.style.border.filter(function (border) {
                return border.borderStyle !== BORDER_STYLE.NONE && !border.borderColor.isTransparent();
            });

            var callback = function callback() {
                var backgroundPaintingArea = calculateBackgroungPaintingArea(container.curvedBounds, container.style.background.backgroundClip);

                if (HAS_BACKGROUND) {
                    _this2.target.clip([backgroundPaintingArea], function () {
                        if (!container.style.background.backgroundColor.isTransparent()) {
                            _this2.target.fill(container.style.background.backgroundColor);
                        }

                        _this2.renderBackgroundImage(container);
                    });
                }

                renderableBorders.forEach(function (border, side) {
                    _this2.renderBorder(border, side, container.curvedBounds);
                });
            };

            if (HAS_BACKGROUND || renderableBorders.length) {
                var paths = container.parent ? container.parent.getClipPaths() : [];
                if (paths.length) {
                    this.target.clip(paths, callback);
                } else {
                    callback();
                }
            }
        }
    }, {
        key: 'renderBackgroundImage',
        value: function renderBackgroundImage(container) {
            var _this3 = this;

            container.style.background.backgroundImage.slice(0).reverse().forEach(function (backgroundImage) {
                if (backgroundImage.source.method === 'url' && backgroundImage.source.args.length) {
                    _this3.renderBackgroundRepeat(container, backgroundImage);
                } else {
                    var _gradient = parseGradient(backgroundImage.source, container.bounds);
                    if (_gradient) {
                        var _bounds = container.bounds;
                        _this3.target.renderLinearGradient(_bounds, _gradient);
                    }
                }
            });
        }
    }, {
        key: 'renderBackgroundRepeat',
        value: function renderBackgroundRepeat(container, background) {
            var image = this.options.imageStore.get(background.source.args[0]);
            if (image) {
                var _bounds2 = container.bounds;
                var paddingBox = calculatePaddingBox(_bounds2, container.style.border);
                var backgroundImageSize = calculateBackgroundSize(background, image, _bounds2);

                // TODO support CONTENT_BOX
                var backgroundPositioningArea = container.style.background.backgroundOrigin === BACKGROUND_ORIGIN.BORDER_BOX ? _bounds2 : paddingBox;

                var position = calculateBackgroundPosition(background.position, backgroundImageSize, backgroundPositioningArea);
                var _path = calculateBackgroundRepeatPath(background, position, backgroundImageSize, backgroundPositioningArea, _bounds2);

                var _offsetX = Math.round(paddingBox.left + position.x);
                var _offsetY = Math.round(paddingBox.top + position.y);
                this.target.renderRepeat(_path, image, backgroundImageSize, _offsetX, _offsetY);
            }
        }
    }, {
        key: 'renderBorder',
        value: function renderBorder(border, side, curvePoints) {
            this.target.drawShape(parsePathForBorder(curvePoints, side), border.borderColor);
        }
    }, {
        key: 'renderStack',
        value: function renderStack(stack) {
            var _this4 = this;

            if (stack.container.isVisible()) {
                var _opacity = stack.getOpacity();
                if (_opacity !== this._opacity) {
                    this.target.setOpacity(stack.getOpacity());
                    this._opacity = _opacity;
                }

                var _transform = stack.container.style.transform;
                if (_transform !== null) {
                    this.target.transform(stack.container.bounds.left + _transform.transformOrigin[0].value, stack.container.bounds.top + _transform.transformOrigin[1].value, _transform.transform, function () {
                        return _this4.renderStackContent(stack);
                    });
                } else {
                    this.renderStackContent(stack);
                }
            }
        }
    }, {
        key: 'renderStackContent',
        value: function renderStackContent(stack) {
            var _splitStackingContext = splitStackingContexts(stack),
                _splitStackingContext2 = _slicedToArray(_splitStackingContext, 5),
                negativeZIndex = _splitStackingContext2[0],
                zeroOrAutoZIndexOrTransformedOrOpacity = _splitStackingContext2[1],
                positiveZIndex = _splitStackingContext2[2],
                nonPositionedFloats = _splitStackingContext2[3],
                nonPositionedInlineLevel = _splitStackingContext2[4];

            var _splitDescendants = splitDescendants(stack),
                _splitDescendants2 = _slicedToArray(_splitDescendants, 2),
                inlineLevel = _splitDescendants2[0],
                nonInlineLevel = _splitDescendants2[1];

            // https://www.w3.org/TR/css-position-3/#painting-order
            // 1. the background and borders of the element forming the stacking context.


            this.renderNodeBackgroundAndBorders(stack.container);
            // 2. the child stacking contexts with negative stack levels (most negative first).
            negativeZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
            this.renderNodeContent(stack.container);
            nonInlineLevel.forEach(this.renderNode, this);
            // 4. All non-positioned floating descendants, in tree order. For each one of these,
            // treat the element as if it created a new stacking context, but any positioned descendants and descendants
            // which actually create a new stacking context should be considered part of the parent stacking context,
            // not this new one.
            nonPositionedFloats.forEach(this.renderStack, this);
            // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
            nonPositionedInlineLevel.forEach(this.renderStack, this);
            inlineLevel.forEach(this.renderNode, this);
            // 6. All positioned, opacity or transform descendants, in tree order that fall into the following categories:
            //  All positioned descendants with 'z-index: auto' or 'z-index: 0', in tree order.
            //  For those with 'z-index: auto', treat the element as if it created a new stacking context,
            //  but any positioned descendants and descendants which actually create a new stacking context should be
            //  considered part of the parent stacking context, not this new one. For those with 'z-index: 0',
            //  treat the stacking context generated atomically.
            //
            //  All opacity descendants with opacity less than 1
            //
            //  All transform descendants with transform other than none
            zeroOrAutoZIndexOrTransformedOrOpacity.forEach(this.renderStack, this);
            // 7. Stacking contexts formed by positioned descendants with z-indices greater than or equal to 1 in z-index
            // order (smallest first) then tree order.
            positiveZIndex.sort(sortByZIndex).forEach(this.renderStack, this);
        }
    }, {
        key: 'render',
        value: function render(stack) {
            if (this.options.backgroundColor) {
                this.target.rectangle(0, 0, this.options.width, this.options.height, this.options.backgroundColor);
            }
            this.renderStack(stack);
            var target = this.target.getTarget();
            return target;
        }
    }]);

    return Renderer;
}();

var splitDescendants = function splitDescendants(stack) {
    var inlineLevel = [];
    var nonInlineLevel = [];

    var length = stack.children.length;
    for (var i = 0; i < length; i++) {
        var child = stack.children[i];
        if (child.isInlineLevel()) {
            inlineLevel.push(child);
        } else {
            nonInlineLevel.push(child);
        }
    }
    return [inlineLevel, nonInlineLevel];
};

var splitStackingContexts = function splitStackingContexts(stack) {
    var negativeZIndex = [];
    var zeroOrAutoZIndexOrTransformedOrOpacity = [];
    var positiveZIndex = [];
    var nonPositionedFloats = [];
    var nonPositionedInlineLevel = [];
    var length = stack.contexts.length;
    for (var i = 0; i < length; i++) {
        var child = stack.contexts[i];
        if (child.container.isPositioned() || child.container.style.opacity < 1 || child.container.isTransformed()) {
            if (child.container.style.zIndex.order < 0) {
                negativeZIndex.push(child);
            } else if (child.container.style.zIndex.order > 0) {
                positiveZIndex.push(child);
            } else {
                zeroOrAutoZIndexOrTransformedOrOpacity.push(child);
            }
        } else {
            if (child.container.isFloating()) {
                nonPositionedFloats.push(child);
            } else {
                nonPositionedInlineLevel.push(child);
            }
        }
    }
    return [negativeZIndex, zeroOrAutoZIndexOrTransformedOrOpacity, positiveZIndex, nonPositionedFloats, nonPositionedInlineLevel];
};

var sortByZIndex = function sortByZIndex(a, b) {
    if (a.container.style.zIndex.order > b.container.style.zIndex.order) {
        return 1;
    } else if (a.container.style.zIndex.order < b.container.style.zIndex.order) {
        return -1;
    }

    return a.container.index > b.container.index ? 1 : -1;
};

'use strict';

var Proxy = function Proxy(src, options) {
    if (!options.proxy) {
        return _Promise.reject(null);
    }
    var proxy = options.proxy;

    return new _Promise(function (resolve, reject) {
        var responseType = FEATURES.SUPPORT_CORS_XHR && FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
        var xhr = FEATURES.SUPPORT_CORS_XHR ? new XMLHttpRequest() : new XDomainRequest();
        xhr.onload = function () {
            if (xhr instanceof XMLHttpRequest) {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        resolve(xhr.response);
                    } else {
                        var reader = new FileReader();
                        // $FlowFixMe
                        reader.addEventListener('load', function () {
                            return resolve(reader.result);
                        }, false);
                        // $FlowFixMe
                        reader.addEventListener('error', function (e) {
                            return reject(e);
                        }, false);
                        reader.readAsDataURL(xhr.response);
                    }
                } else {
                    reject('');
                }
            } else {
                resolve(xhr.responseText);
            }
        };

        xhr.onerror = reject;
        xhr.open('GET', proxy + '?url=' + encodeURIComponent(src) + '&responseType=' + responseType);

        if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
            xhr.responseType = responseType;
        }

        if (options.imageTimeout) {
            var timeout = options.imageTimeout;
            xhr.timeout = timeout;
            xhr.ontimeout = function () {
                return reject('');
            };
        }

        xhr.send();
    });
};

'use strict';

// $FlowFixMe

var ImageLoader = function () {
    function ImageLoader(options, logger, window) {
        _classCallCheck(this, ImageLoader);

        this.options = options;
        this._window = window;
        this.origin = this.getOrigin(window.location.href);
        this.cache = {};
        this.logger = logger;
        this._index = 0;
    }

    _createClass(ImageLoader, [{
        key: 'loadImage',
        value: function loadImage(src) {
            var _this = this;

            if (this.hasImageInCache(src)) {
                return src;
            }

            if (isSVG(src)) {
                if (this.options.allowTaint === true || FEATURES.SUPPORT_SVG_DRAWING) {
                    return this.addImage(src, src, false);
                }
            } else {
                if (this.options.allowTaint === true || isInlineBase64Image(src) || this.isSameOrigin(src)) {
                    return this.addImage(src, src, false);
                } else if (!this.isSameOrigin(src)) {
                    if (typeof this.options.proxy === 'string') {
                        this.cache[src] = Proxy(src, this.options).then(function (src) {
                            return _loadImage(src, _this.options.imageTimeout || 0);
                        });
                        return src;
                    } else if (this.options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES) {
                        return this.addImage(src, src, true);
                    }
                }
            }
        }
    }, {
        key: 'inlineImage',
        value: function inlineImage(src) {
            var _this2 = this;

            if (isInlineImage(src)) {
                return _loadImage(src, this.options.imageTimeout || 0);
            }
            if (this.hasImageInCache(src)) {
                return this.cache[src];
            }
            if (!this.isSameOrigin(src) && typeof this.options.proxy === 'string') {
                return this.cache[src] = Proxy(src, this.options).then(function (src) {
                    return _loadImage(src, _this2.options.imageTimeout || 0);
                });
            }

            return this.xhrImage(src);
        }
    }, {
        key: 'xhrImage',
        value: function xhrImage(src) {
            var _this3 = this;

            this.cache[src] = new _Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status !== 200) {
                            reject('Failed to fetch image ' + src.substring(0, 256) + ' with status code ' + xhr.status);
                        } else {
                            var reader = new FileReader();
                            // $FlowFixMe
                            reader.addEventListener('load', function () {
                                return resolve(reader.result);
                            }, false);
                            // $FlowFixMe
                            reader.addEventListener('error', function (e) {
                                return reject(e);
                            }, false);
                            reader.readAsDataURL(xhr.response);
                        }
                    }
                };
                xhr.responseType = 'blob';
                if (_this3.options.imageTimeout) {
                    var timeout = _this3.options.imageTimeout;
                    xhr.timeout = timeout;
                    xhr.ontimeout = function () {
                        return reject('');
                    };
                }
                xhr.open('GET', src, true);
                xhr.send();
            }).then(function (src) {
                return _loadImage(src, _this3.options.imageTimeout || 0);
            });

            return this.cache[src];
        }
    }, {
        key: 'loadCanvas',
        value: function loadCanvas(node) {
            var key = String(this._index++);
            this.cache[key] = _Promise.resolve(node);
            return key;
        }
    }, {
        key: 'hasImageInCache',
        value: function hasImageInCache(key) {
            return typeof this.cache[key] !== 'undefined';
        }
    }, {
        key: 'addImage',
        value: function addImage(key, src, useCORS) {
            var _this4 = this;

            var imageLoadHandler = function imageLoadHandler(supportsDataImages) {
                return new _Promise(function (resolve, reject) {
                    var img = new Image();
                    img.onload = function () {
                        return resolve(img);
                    };
                    //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
                    if (!supportsDataImages || useCORS) {
                        img.crossOrigin = 'anonymous';
                    }

                    img.onerror = reject;
                    img.src = src;
                    if (img.complete === true) {
                        // Inline XML images may fail to parse, throwing an Error later on
                        setTimeout(function () {
                            resolve(img);
                        }, 500);
                    }
                    if (_this4.options.imageTimeout) {
                        var timeout = _this4.options.imageTimeout;
                        setTimeout(function () {
                            return reject('');
                        }, timeout);
                    }
                });
            };

            this.cache[key] = isInlineBase64Image(src) && !isSVG(src) ? // $FlowFixMe
            FEATURES.SUPPORT_BASE64_DRAWING(src).then(imageLoadHandler) : imageLoadHandler(true);
            return key;
        }
    }, {
        key: 'isSameOrigin',
        value: function isSameOrigin(url) {
            return this.getOrigin(url) === this.origin;
        }
    }, {
        key: 'getOrigin',
        value: function getOrigin(url) {
            var link = this._link || (this._link = this._window.document.createElement('a'));
            link.href = url;
            link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
            return link.protocol + link.hostname + link.port;
        }
    }, {
        key: 'ready',
        value: function ready() {
            var _this5 = this;

            var keys$$1 = _Object$keys(this.cache);
            return _Promise.all(keys$$1.map(function (str) {
                return _this5.cache[str].catch(function (e) {
                    return null;
                });
            })).then(function (images) {
                return new ImageStore(keys$$1, images);
            });
        }
    }]);

    return ImageLoader;
}();

var ImageStore = function () {
    function ImageStore(keys$$1, images) {
        _classCallCheck(this, ImageStore);

        this._keys = keys$$1;
        this._images = images;
    }

    _createClass(ImageStore, [{
        key: 'get',
        value: function get(key) {
            var index = this._keys.indexOf(key);
            return index === -1 ? null : this._images[index];
        }
    }]);

    return ImageStore;
}();

var INLINE_SVG = /^data:image\/svg\+xml/i;
var INLINE_BASE64 = /^data:image\/.*;base64,/i;
var INLINE_IMG = /^data:image\/.*/i;

var isInlineImage = function isInlineImage(src) {
    return INLINE_IMG.test(src);
};
var isInlineBase64Image = function isInlineBase64Image(src) {
    return INLINE_BASE64.test(src);
};

var isSVG = function isSVG(src) {
    return src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
};

var _loadImage = function _loadImage(src, timeout) {
    return new _Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            return resolve(img);
        };
        img.onerror = reject;
        img.src = src;
        if (img.complete === true) {
            // Inline XML images may fail to parse, throwing an Error later on
            setTimeout(function () {
                resolve(img);
            }, 500);
        }
        if (timeout) {
            setTimeout(function () {
                return reject('');
            }, timeout);
        }
    });
};

'use strict';

var DocumentCloner = function () {
    function DocumentCloner(element, options, logger, copyInline, renderer) {
        _classCallCheck(this, DocumentCloner);

        this.referenceElement = element;
        this.scrolledElements = [];
        this.copyStyles = copyInline;
        this.inlineImages = copyInline;
        this.logger = logger;
        this.options = options;
        this.renderer = renderer;
        this.imageLoader = new ImageLoader(options, logger, window);
        // $FlowFixMe
        this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
    }

    _createClass(DocumentCloner, [{
        key: 'inlineAllImages',
        value: function inlineAllImages(node) {
            var _this = this;

            if (this.inlineImages && node) {
                var style = node.style;
                _Promise.all(parseBackgroundImage(style.backgroundImage).map(function (backgroundImage) {
                    if (backgroundImage.method === 'url') {
                        return _this.imageLoader.inlineImage(backgroundImage.args[0]).then(function (img) {
                            return img ? 'url("' + img.src + '")' : 'none';
                        }).catch(function (e) {
                            
                        });
                    }
                    return _Promise.resolve('' + backgroundImage.prefix + backgroundImage.method + '(' + backgroundImage.args.join(',') + ')');
                })).then(function (backgroundImages) {
                    if (backgroundImages.length > 1) {
                        // TODO Multiple backgrounds somehow broken in Chrome
                        style.backgroundColor = '';
                    }
                    style.backgroundImage = backgroundImages.join(',');
                });

                if (node instanceof HTMLImageElement) {
                    this.imageLoader.inlineImage(node.src).then(function (img) {
                        if (img && node instanceof HTMLImageElement && node.parentNode) {
                            var parentNode = node.parentNode;
                            var clonedChild = copyCSSStyles(node.style, img.cloneNode(false));
                            parentNode.replaceChild(clonedChild, node);
                        }
                    }).catch(function (e) {
                        
                    });
                }
            }
        }
    }, {
        key: 'createElementClone',
        value: function createElementClone(node) {
            var _this2 = this;

            if (this.copyStyles && node instanceof HTMLCanvasElement) {
                var img = node.ownerDocument.createElement('img');
                try {
                    img.src = node.toDataURL();
                    return img;
                } catch (e) {
                    
                }
            }

            if (node instanceof HTMLIFrameElement) {
                var tempIframe = node.cloneNode(false);
                var iframeKey = generateIframeKey();
                tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

                this.imageLoader.cache[iframeKey] = getIframeDocumentElement(node, this.options).then(function (documentElement) {
                    return _this2.renderer(documentElement, {
                        async: _this2.options.async,
                        allowTaint: _this2.options.allowTaint,
                        backgroundColor: '#ffffff',
                        canvas: null,
                        imageTimeout: _this2.options.imageTimeout,
                        proxy: _this2.options.proxy,
                        removeContainer: _this2.options.removeContainer,
                        scale: _this2.options.scale,
                        target: new CanvasRenderer(),
                        type: 'view',
                        windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
                        windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
                        offsetX: documentElement.ownerDocument.defaultView.pageXOffset,
                        offsetY: documentElement.ownerDocument.defaultView.pageYOffset
                    }, _this2.logger.child(iframeKey));
                }).then(function (canvas) {
                    var iframeCanvas = document.createElement('img');
                    iframeCanvas.src = canvas.toDataURL();
                    if (tempIframe.parentNode) {
                        tempIframe.parentNode.replaceChild(copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), iframeCanvas), tempIframe);
                    }
                    return canvas;
                });
                return tempIframe;
            }

            return node.cloneNode(false);
        }
    }, {
        key: 'cloneNode',
        value: function cloneNode(node) {
            var clone = node.nodeType === Node.TEXT_NODE ? document.createTextNode(node.nodeValue) : this.createElementClone(node);

            var window = node.ownerDocument.defaultView;

            if (this.referenceElement === node && clone instanceof window.HTMLElement) {
                this.clonedReferenceElement = clone;
            }

            if (clone instanceof window.HTMLBodyElement) {
                createPseudoHideStyles(clone);
            }

            for (var child = node.firstChild; child; child = child.nextSibling) {
                if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'SCRIPT') {
                    if (!this.copyStyles || child.nodeName !== 'STYLE') {
                        clone.appendChild(this.cloneNode(child));
                    }
                }
            }
            if (node instanceof window.HTMLElement && clone instanceof window.HTMLElement) {
                this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_BEFORE));
                this.inlineAllImages(inlinePseudoElement(node, clone, PSEUDO_AFTER));
                if (this.copyStyles && !(node instanceof HTMLIFrameElement)) {
                    copyCSSStyles(node.ownerDocument.defaultView.getComputedStyle(node), clone);
                }
                this.inlineAllImages(clone);
                if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                    this.scrolledElements.push([node, node.scrollLeft, node.scrollTop]);
                }
                switch (node.nodeName) {
                    case 'CANVAS':
                        if (!this.copyStyles) {
                            cloneCanvasContents(node, clone);
                        }
                        break;
                    case 'TEXTAREA':
                    case 'SELECT':
                        clone.value = node.value;
                        break;
                }
            }
            return clone;
        }
    }]);

    return DocumentCloner;
}();

var restoreOwnerScroll = function restoreOwnerScroll(ownerDocument, x, y) {
    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
};

var cloneCanvasContents = function cloneCanvasContents(canvas, clonedCanvas) {
    try {
        if (clonedCanvas) {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            clonedCanvas.getContext('2d').putImageData(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), 0, 0);
        }
    } catch (e) {}
};

var inlinePseudoElement = function inlinePseudoElement(node, clone, pseudoElt) {
    var style = node.ownerDocument.defaultView.getComputedStyle(node, pseudoElt);
    if (!style || !style.content || style.content === 'none' || style.content === '-moz-alt-content' || style.display === 'none') {
        return;
    }

    var content = stripQuotes(style.content);
    var image = content.match(URL_REGEXP);
    var anonymousReplacedElement = clone.ownerDocument.createElement(image ? 'img' : 'html2canvaspseudoelement');
    if (image) {
        // $FlowFixMe
        anonymousReplacedElement.src = stripQuotes(image[1]);
    } else {
        anonymousReplacedElement.textContent = content;
    }

    copyCSSStyles(style, anonymousReplacedElement);

    anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ' ' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
    clone.className += pseudoElt === PSEUDO_BEFORE ? ' ' + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE : ' ' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
    if (pseudoElt === PSEUDO_BEFORE) {
        clone.insertBefore(anonymousReplacedElement, clone.firstChild);
    } else {
        clone.appendChild(anonymousReplacedElement);
    }

    return anonymousReplacedElement;
};

var stripQuotes = function stripQuotes(content) {
    var first = content.substr(0, 1);
    return first === content.substr(content.length - 1) && first.match(/['"]/) ? content.substr(1, content.length - 2) : content;
};

var URL_REGEXP = /^url\((.+)\)$/i;
var PSEUDO_BEFORE = ':before';
var PSEUDO_AFTER = ':after';
var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';

var PSEUDO_HIDE_ELEMENT_STYLE = '{\n    content: "" !important;\n    display: none !important;\n}';

var createPseudoHideStyles = function createPseudoHideStyles(body) {
    createStyles(body, '.' + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + '\n         .' + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
};

var createStyles = function createStyles(body, styles) {
    var style = body.ownerDocument.createElement('style');
    style.innerHTML = styles;
    body.appendChild(style);
};

var initNode = function initNode(_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        element = _ref2[0],
        x = _ref2[1],
        y = _ref2[2];

    element.scrollLeft = x;
    element.scrollTop = y;
};

var generateIframeKey = function generateIframeKey() {
    return Math.ceil(Date.now() + Math.random() * 10000000).toString(16);
};

var getIframeDocumentElement = function getIframeDocumentElement(node, options) {
    try {
        return _Promise.resolve(node.contentWindow.document.documentElement);
    } catch (e) {
        return _Promise.reject();
    }
};

var cloneWindow = function cloneWindow(ownerDocument, bounds, referenceElement, options, logger, renderer) {
    var cloner = new DocumentCloner(referenceElement, options, logger, false, renderer);
    var cloneIframeContainer = ownerDocument.createElement('iframe');

    cloneIframeContainer.className = 'html2canvas-container';
    cloneIframeContainer.style.visibility = 'hidden';
    cloneIframeContainer.style.position = 'fixed';
    cloneIframeContainer.style.left = '-10000px';
    cloneIframeContainer.style.top = '0px';
    cloneIframeContainer.style.border = '0';
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
    if (ownerDocument.body) {
        ownerDocument.body.appendChild(cloneIframeContainer);
    } else {
        return _Promise.reject('');
    }
    return new _Promise(function (resolve, reject) {
        var cloneWindow = cloneIframeContainer.contentWindow;
        var documentClone = cloneWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        cloneWindow.onload = cloneIframeContainer.onload = function () {
            var interval = setInterval(function () {
                if (documentClone.body.childNodes.length > 0) {
                    cloner.scrolledElements.forEach(initNode);
                    clearInterval(interval);
                    if (options.type === 'view') {
                        cloneWindow.scrollTo(bounds.left, bounds.top);
                        if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && (cloneWindow.scrollY !== bounds.top || cloneWindow.scrollX !== bounds.left)) {
                            documentClone.documentElement.style.top = -bounds.top + 'px';
                            documentClone.documentElement.style.left = -bounds.left + 'px';
                            documentClone.documentElement.style.position = 'absolute';
                        }
                    }
                    if (cloner.clonedReferenceElement instanceof cloneWindow.HTMLElement || cloner.clonedReferenceElement instanceof HTMLElement) {
                        resolve([cloneIframeContainer, cloner.clonedReferenceElement, cloner.imageLoader]);
                    } else {
                        reject('');
                    }
                }
            }, 50);
        };

        documentClone.open();
        documentClone.write('<!DOCTYPE html><html></html>');
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(referenceElement.ownerDocument, bounds.left, bounds.top);
        documentClone.replaceChild(documentClone.adoptNode(cloner.documentElement), documentClone.documentElement);
        documentClone.close();
    });
};

'use strict';

var renderElement = function renderElement(element, options, logger) {
    var ownerDocument = element.ownerDocument;

    var windowBounds = new Bounds(options.offsetX, options.offsetY, options.windowWidth, options.windowHeight);

    var bounds = options.type === 'view' ? windowBounds : parseDocumentSize(ownerDocument);

    // http://www.w3.org/TR/css3-background/#special-backgrounds
    var documentBackgroundColor = ownerDocument.documentElement ? new Color(getComputedStyle(ownerDocument.documentElement).backgroundColor) : TRANSPARENT;
    var bodyBackgroundColor = ownerDocument.body ? new Color(getComputedStyle(ownerDocument.body).backgroundColor) : TRANSPARENT;

    var backgroundColor = element === ownerDocument.documentElement ? documentBackgroundColor.isTransparent() ? bodyBackgroundColor.isTransparent() ? options.backgroundColor ? new Color(options.backgroundColor) : null : bodyBackgroundColor : documentBackgroundColor : options.backgroundColor ? new Color(options.backgroundColor) : null;

    // $FlowFixMe
    return FEATURES.SUPPORT_FOREIGNOBJECT_DRAWING.then(function (supportForeignObject) {
        return supportForeignObject ? function (cloner) {
            return cloner.imageLoader.ready().then(function () {
                var renderer = new ForeignObjectRenderer(cloner.clonedReferenceElement);
                return renderer.render({
                    bounds: bounds,
                    backgroundColor: backgroundColor,
                    logger: logger,
                    scale: options.scale
                });
            });
        }(new DocumentCloner(element, options, logger, true, renderElement)) : cloneWindow(ownerDocument, windowBounds, element, options, logger, renderElement).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 3),
                container = _ref2[0],
                clonedElement = _ref2[1],
                imageLoader = _ref2[2];

            var stack = NodeParser(clonedElement, imageLoader, logger);
            var clonedDocument = clonedElement.ownerDocument;
            var width = bounds.width;
            var height = bounds.height;

            if (backgroundColor === stack.container.style.background.backgroundColor) {
                stack.container.style.background.backgroundColor = TRANSPARENT;
            }

            return imageLoader.ready().then(function (imageStore) {
                if (options.removeContainer === true) {
                    if (container.parentNode) {
                        container.parentNode.removeChild(container);
                    } else {}
                }

                var fontMetrics = new FontMetrics(clonedDocument);
                var renderOptions = {
                    backgroundColor: backgroundColor,
                    fontMetrics: fontMetrics,
                    imageStore: imageStore,
                    logger: logger,
                    scale: options.scale,
                    width: width,
                    height: height
                };

                if (Array.isArray(options.target)) {
                    return _Promise.all(options.target.map(function (target) {
                        var renderer = new Renderer(target, renderOptions);
                        return renderer.render(stack);
                    }));
                } else {
                    var renderer = new Renderer(options.target, renderOptions);
                    return renderer.render(stack);
                }
            });
        });
    });
};

'use strict';

var html2canvas = function html2canvas(element, conf) {
    if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && typeof console.log === 'function') {
        console.log('html2canvas ' + '1.0.0-alpha.1');
    }

    var config = conf || {};
    var logger = new Logger();

    var ownerDocument = element.ownerDocument;
    var defaultView = ownerDocument.defaultView;

    var defaultOptions = {
        async: true,
        allowTaint: false,
        imageTimeout: 15000,
        proxy: null,
        removeContainer: true,
        scale: defaultView.devicePixelRatio || 1,
        target: new CanvasRenderer(config.canvas),
        type: null,
        windowWidth: defaultView.innerWidth,
        windowHeight: defaultView.innerHeight,
        offsetX: defaultView.pageXOffset,
        offsetY: defaultView.pageYOffset
    };

    var result = renderElement(element, _extends$1({}, defaultOptions, config), logger);

    {
        return result.catch(function (e) {
            logger.error(e);
            throw e;
        });
    }
    return result;
};

html2canvas.CanvasRenderer = CanvasRenderer;

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */

function RGBColor(color_string) {
	this.ok = false;

	// strip any leading #
	if (color_string.charAt(0) == '#') {
		// remove # if any
		color_string = color_string.substr(1, 6);
	}

	color_string = color_string.replace(/ /g, '');
	color_string = color_string.toLowerCase();

	// before getting into regexps, try simple matches
	// and overwrite the input
	var simple_colors = {
		aliceblue: 'f0f8ff',
		antiquewhite: 'faebd7',
		aqua: '00ffff',
		aquamarine: '7fffd4',
		azure: 'f0ffff',
		beige: 'f5f5dc',
		bisque: 'ffe4c4',
		black: '000000',
		blanchedalmond: 'ffebcd',
		blue: '0000ff',
		blueviolet: '8a2be2',
		brown: 'a52a2a',
		burlywood: 'deb887',
		cadetblue: '5f9ea0',
		chartreuse: '7fff00',
		chocolate: 'd2691e',
		coral: 'ff7f50',
		cornflowerblue: '6495ed',
		cornsilk: 'fff8dc',
		crimson: 'dc143c',
		cyan: '00ffff',
		darkblue: '00008b',
		darkcyan: '008b8b',
		darkgoldenrod: 'b8860b',
		darkgray: 'a9a9a9',
		darkgreen: '006400',
		darkkhaki: 'bdb76b',
		darkmagenta: '8b008b',
		darkolivegreen: '556b2f',
		darkorange: 'ff8c00',
		darkorchid: '9932cc',
		darkred: '8b0000',
		darksalmon: 'e9967a',
		darkseagreen: '8fbc8f',
		darkslateblue: '483d8b',
		darkslategray: '2f4f4f',
		darkturquoise: '00ced1',
		darkviolet: '9400d3',
		deeppink: 'ff1493',
		deepskyblue: '00bfff',
		dimgray: '696969',
		dodgerblue: '1e90ff',
		feldspar: 'd19275',
		firebrick: 'b22222',
		floralwhite: 'fffaf0',
		forestgreen: '228b22',
		fuchsia: 'ff00ff',
		gainsboro: 'dcdcdc',
		ghostwhite: 'f8f8ff',
		gold: 'ffd700',
		goldenrod: 'daa520',
		gray: '808080',
		green: '008000',
		greenyellow: 'adff2f',
		honeydew: 'f0fff0',
		hotpink: 'ff69b4',
		indianred: 'cd5c5c',
		indigo: '4b0082',
		ivory: 'fffff0',
		khaki: 'f0e68c',
		lavender: 'e6e6fa',
		lavenderblush: 'fff0f5',
		lawngreen: '7cfc00',
		lemonchiffon: 'fffacd',
		lightblue: 'add8e6',
		lightcoral: 'f08080',
		lightcyan: 'e0ffff',
		lightgoldenrodyellow: 'fafad2',
		lightgrey: 'd3d3d3',
		lightgreen: '90ee90',
		lightpink: 'ffb6c1',
		lightsalmon: 'ffa07a',
		lightseagreen: '20b2aa',
		lightskyblue: '87cefa',
		lightslateblue: '8470ff',
		lightslategray: '778899',
		lightsteelblue: 'b0c4de',
		lightyellow: 'ffffe0',
		lime: '00ff00',
		limegreen: '32cd32',
		linen: 'faf0e6',
		magenta: 'ff00ff',
		maroon: '800000',
		mediumaquamarine: '66cdaa',
		mediumblue: '0000cd',
		mediumorchid: 'ba55d3',
		mediumpurple: '9370d8',
		mediumseagreen: '3cb371',
		mediumslateblue: '7b68ee',
		mediumspringgreen: '00fa9a',
		mediumturquoise: '48d1cc',
		mediumvioletred: 'c71585',
		midnightblue: '191970',
		mintcream: 'f5fffa',
		mistyrose: 'ffe4e1',
		moccasin: 'ffe4b5',
		navajowhite: 'ffdead',
		navy: '000080',
		oldlace: 'fdf5e6',
		olive: '808000',
		olivedrab: '6b8e23',
		orange: 'ffa500',
		orangered: 'ff4500',
		orchid: 'da70d6',
		palegoldenrod: 'eee8aa',
		palegreen: '98fb98',
		paleturquoise: 'afeeee',
		palevioletred: 'd87093',
		papayawhip: 'ffefd5',
		peachpuff: 'ffdab9',
		peru: 'cd853f',
		pink: 'ffc0cb',
		plum: 'dda0dd',
		powderblue: 'b0e0e6',
		purple: '800080',
		red: 'ff0000',
		rosybrown: 'bc8f8f',
		royalblue: '4169e1',
		saddlebrown: '8b4513',
		salmon: 'fa8072',
		sandybrown: 'f4a460',
		seagreen: '2e8b57',
		seashell: 'fff5ee',
		sienna: 'a0522d',
		silver: 'c0c0c0',
		skyblue: '87ceeb',
		slateblue: '6a5acd',
		slategray: '708090',
		snow: 'fffafa',
		springgreen: '00ff7f',
		steelblue: '4682b4',
		tan: 'd2b48c',
		teal: '008080',
		thistle: 'd8bfd8',
		tomato: 'ff6347',
		turquoise: '40e0d0',
		violet: 'ee82ee',
		violetred: 'd02090',
		wheat: 'f5deb3',
		white: 'ffffff',
		whitesmoke: 'f5f5f5',
		yellow: 'ffff00',
		yellowgreen: '9acd32'
	};
	for (var key in simple_colors) {
		if (color_string == key) {
			color_string = simple_colors[key];
		}
	}
	// emd of simple type-in colors

	// array of color definition objects
	var color_defs = [{
		re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
		example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
		process: function process(bits) {
			return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
		}
	}, {
		re: /^(\w{2})(\w{2})(\w{2})$/,
		example: ['#00ff00', '336699'],
		process: function process(bits) {
			return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
		}
	}, {
		re: /^(\w{1})(\w{1})(\w{1})$/,
		example: ['#fb0', 'f0f'],
		process: function process(bits) {
			return [parseInt(bits[1] + bits[1], 16), parseInt(bits[2] + bits[2], 16), parseInt(bits[3] + bits[3], 16)];
		}
	}];

	// search through the definitions to find a match
	for (var i = 0; i < color_defs.length; i++) {
		var re = color_defs[i].re;
		var processor = color_defs[i].process;
		var bits = re.exec(color_string);
		if (bits) {
			channels = processor(bits);
			this.r = channels[0];
			this.g = channels[1];
			this.b = channels[2];
			this.ok = true;
		}
	}

	// validate/cleanup values
	this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
	this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
	this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;

	// some getters
	this.toRGB = function () {
		return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
	};
	this.toHex = function () {
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		if (r.length == 1) r = '0' + r;
		if (g.length == 1) g = '0' + g;
		if (b.length == 1) b = '0' + b;
		return '#' + r + g + b;
	};

	// help
	this.getHelpXML = function () {

		var examples = new Array();
		// add regexps
		for (var i = 0; i < color_defs.length; i++) {
			var example = color_defs[i].example;
			for (var j = 0; j < example.length; j++) {
				examples[examples.length] = example[j];
			}
		}
		// add type-in colors
		for (var sc in simple_colors) {
			examples[examples.length] = sc;
		}

		var xml = document.createElement('ul');
		xml.setAttribute('id', 'rgbcolor-examples');
		for (var i = 0; i < examples.length; i++) {
			try {
				var list_item = document.createElement('li');
				var list_color = new RGBColor(examples[i]);
				var example_div = document.createElement('div');
				example_div.style.cssText = 'margin: 3px; ' + 'border: 1px solid black; ' + 'background:' + list_color.toHex() + '; ' + 'color:' + list_color.toHex();
				example_div.appendChild(document.createTextNode('test'));
				var list_item_value = document.createTextNode(' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex());
				list_item.appendChild(example_div);
				list_item.appendChild(list_item_value);
				xml.appendChild(list_item);
			} catch (e) {}
		}
		return xml;
	};
}

/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

function premultiplyAlpha(imageData) {
	var pixels = imageData.data;
	var size = imageData.width * imageData.height * 4;

	for (var i = 0; i < size; i += 4) {
		var a = pixels[i + 3] / 255;
		pixels[i] *= a;
		pixels[i + 1] *= a;
		pixels[i + 2] *= a;
	}
}

function unpremultiplyAlpha(imageData) {
	var pixels = imageData.data;
	var size = imageData.width * imageData.height * 4;

	for (var i = 0; i < size; i += 4) {
		var a = pixels[i + 3];
		if (a != 0) {
			a = 255 / a;
			pixels[i] *= a;
			pixels[i + 1] *= a;
			pixels[i + 2] *= a;
		}
	}
}

function stackBlurImage(imageID, canvasID, radius, blurAlphaChannel) {

	var img = document.getElementById(imageID);
	var w = img.naturalWidth;
	var h = img.naturalHeight;

	var canvas = document.getElementById(canvasID);

	canvas.style.width = w + "px";
	canvas.style.height = h + "px";
	canvas.width = w;
	canvas.height = h;

	var context = canvas.getContext("2d");
	context.clearRect(0, 0, w, h);
	context.drawImage(img, 0, 0);

	if (isNaN(radius) || radius < 1) return;

	if (blurAlphaChannel) stackBlurCanvasRGBA(canvasID, 0, 0, w, h, radius);else stackBlurCanvasRGB(canvasID, 0, 0, w, h, radius);
}

function stackBlurCanvasRGBA(id, top_x, top_y, width, height, radius) {
	if (isNaN(radius) || radius < 1) return;
	radius |= 0;

	var canvas = document.getElementById(id);
	var context = canvas.getContext("2d");
	var imageData;

	try {
		try {
			imageData = context.getImageData(top_x, top_y, width, height);
		} catch (e) {

			// NOTE: this part is supposedly only needed if you want to work with local files
			// so it might be okay to remove the whole try/catch block and just use
			// imageData = context.getImageData( top_x, top_y, width, height );
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				imageData = context.getImageData(top_x, top_y, width, height);
			} catch (e) {
				alert("Cannot access local image");
				throw new Error("unable to access local image data: " + e);
				return;
			}
		}
	} catch (e) {
		alert("Cannot access image");
		throw new Error("unable to access image data: " + e);
	}

	premultiplyAlpha(imageData);

	var pixels = imageData.data;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;

	var div = radius + radius + 1;
	var widthMinus1 = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1 = radius + 1;
	var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

	var stackStart = new BlurStack();
	var stack = stackStart;
	for (i = 1; i < div; i++) {
		stack = stack.next = new BlurStack();
		if (i == radiusPlus1) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	for (y = 0; y < height; y++) {
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

		r_out_sum = radiusPlus1 * (pr = pixels[yi]);
		g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
		b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
		a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		for (i = 1; i < radiusPlus1; i++) {
			p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
			r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
			g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
			b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
			a_sum += (stack.a = pa = pixels[p + 3]) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;
		}

		stackIn = stackStart;
		stackOut = stackEnd;
		for (x = 0; x < width; x++) {
			pixels[yi] = r_sum * mul_sum >> shg_sum;
			pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
			pixels[yi + 2] = b_sum * mul_sum >> shg_sum;
			pixels[yi + 3] = a_sum * mul_sum >> shg_sum;

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

			r_in_sum += stackIn.r = pixels[p];
			g_in_sum += stackIn.g = pixels[p + 1];
			b_in_sum += stackIn.b = pixels[p + 2];
			a_in_sum += stackIn.a = pixels[p + 3];

			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;

			stackIn = stackIn.next;

			r_out_sum += pr = stackOut.r;
			g_out_sum += pg = stackOut.g;
			b_out_sum += pb = stackOut.b;
			a_out_sum += pa = stackOut.a;

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	for (x = 0; x < width; x++) {
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

		yi = x << 2;
		r_out_sum = radiusPlus1 * (pr = pixels[yi]);
		g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
		b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
		a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}

		yp = width;

		for (i = 1; i <= radius; i++) {
			yi = yp + x << 2;

			r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
			g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
			b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
			a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;

			stack = stack.next;

			if (i < heightMinus1) {
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for (y = 0; y < height; y++) {
			p = yi << 2;
			pixels[p] = r_sum * mul_sum >> shg_sum;
			pixels[p + 1] = g_sum * mul_sum >> shg_sum;
			pixels[p + 2] = b_sum * mul_sum >> shg_sum;
			pixels[p + 3] = a_sum * mul_sum >> shg_sum;

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;

			p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

			r_sum += r_in_sum += stackIn.r = pixels[p];
			g_sum += g_in_sum += stackIn.g = pixels[p + 1];
			b_sum += b_in_sum += stackIn.b = pixels[p + 2];
			a_sum += a_in_sum += stackIn.a = pixels[p + 3];

			stackIn = stackIn.next;

			r_out_sum += pr = stackOut.r;
			g_out_sum += pg = stackOut.g;
			b_out_sum += pb = stackOut.b;
			a_out_sum += pa = stackOut.a;

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	unpremultiplyAlpha(imageData);

	context.putImageData(imageData, top_x, top_y);
}

function stackBlurCanvasRGB(id, top_x, top_y, width, height, radius) {
	if (isNaN(radius) || radius < 1) return;
	radius |= 0;

	var canvas = document.getElementById(id);
	var context = canvas.getContext("2d");
	var imageData;

	try {
		try {
			imageData = context.getImageData(top_x, top_y, width, height);
		} catch (e) {

			// NOTE: this part is supposedly only needed if you want to work with local files
			// so it might be okay to remove the whole try/catch block and just use
			// imageData = context.getImageData( top_x, top_y, width, height );
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
				imageData = context.getImageData(top_x, top_y, width, height);
			} catch (e) {
				alert("Cannot access local image");
				throw new Error("unable to access local image data: " + e);
				return;
			}
		}
	} catch (e) {
		alert("Cannot access image");
		throw new Error("unable to access image data: " + e);
	}

	var pixels = imageData.data;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, r_out_sum, g_out_sum, b_out_sum, r_in_sum, g_in_sum, b_in_sum, pr, pg, pb, rbs;

	var div = radius + radius + 1;
	var widthMinus1 = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1 = radius + 1;
	var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

	var stackStart = new BlurStack();
	var stack = stackStart;
	for (i = 1; i < div; i++) {
		stack = stack.next = new BlurStack();
		if (i == radiusPlus1) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;

	yw = yi = 0;

	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];

	for (y = 0; y < height; y++) {
		r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

		r_out_sum = radiusPlus1 * (pr = pixels[yi]);
		g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
		b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		for (i = 1; i < radiusPlus1; i++) {
			p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
			r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
			g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
			b_sum += (stack.b = pb = pixels[p + 2]) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;

			stack = stack.next;
		}

		stackIn = stackStart;
		stackOut = stackEnd;
		for (x = 0; x < width; x++) {
			pixels[yi] = r_sum * mul_sum >> shg_sum;
			pixels[yi + 1] = g_sum * mul_sum >> shg_sum;
			pixels[yi + 2] = b_sum * mul_sum >> shg_sum;

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;

			p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

			r_in_sum += stackIn.r = pixels[p];
			g_in_sum += stackIn.g = pixels[p + 1];
			b_in_sum += stackIn.b = pixels[p + 2];

			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;

			stackIn = stackIn.next;

			r_out_sum += pr = stackOut.r;
			g_out_sum += pg = stackOut.g;
			b_out_sum += pb = stackOut.b;

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;

			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	for (x = 0; x < width; x++) {
		g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

		yi = x << 2;
		r_out_sum = radiusPlus1 * (pr = pixels[yi]);
		g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
		b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;

		stack = stackStart;

		for (i = 0; i < radiusPlus1; i++) {
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}

		yp = width;

		for (i = 1; i <= radius; i++) {
			yi = yp + x << 2;

			r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
			g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
			b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;

			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;

			stack = stack.next;

			if (i < heightMinus1) {
				yp += width;
			}
		}

		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for (y = 0; y < height; y++) {
			p = yi << 2;
			pixels[p] = r_sum * mul_sum >> shg_sum;
			pixels[p + 1] = g_sum * mul_sum >> shg_sum;
			pixels[p + 2] = b_sum * mul_sum >> shg_sum;

			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;

			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;

			p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;

			r_sum += r_in_sum += stackIn.r = pixels[p];
			g_sum += g_in_sum += stackIn.g = pixels[p + 1];
			b_sum += b_in_sum += stackIn.b = pixels[p + 2];

			stackIn = stackIn.next;

			r_out_sum += pr = stackOut.r;
			g_out_sum += pg = stackOut.g;
			b_out_sum += pb = stackOut.b;

			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;

			stackOut = stackOut.next;

			yi += width;
		}
	}

	context.putImageData(imageData, top_x, top_y);
}

function BlurStack() {
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}

var stackBlur = {
	image: stackBlurImage,
	canvasRGBA: stackBlurCanvasRGBA,
	canvasRGB: stackBlurCanvasRGB
};

/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */

// canvg(target, s)
// empty parameters: replace all 'svg' elements on page with 'canvas' elements
// target: canvas element or the id of a canvas element
// s: svg string, url to svg file, or xml document
// opts: optional hash of options
//		 ignoreMouse: true => ignore mouse events
//		 ignoreAnimation: true => ignore animations
//		 ignoreDimensions: true => does not try to resize canvas
//		 ignoreClear: true => does not clear canvas
//		 offsetX: int => draws at a x offset
//		 offsetY: int => draws at a y offset
//		 scaleWidth: int => scales horizontally to width
//		 scaleHeight: int => scales vertically to height
//		 renderCallback: function => will call the function after the first render is completed
//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
var canvg = function canvg(target, s, opts) {
	// no parameters
	if (target == null && s == null && opts == null) {
		var svgTags = document.querySelectorAll('svg');
		for (var i = 0; i < svgTags.length; i++) {
			var svgTag = svgTags[i];
			var c = document.createElement('canvas');
			c.width = svgTag.clientWidth;
			c.height = svgTag.clientHeight;
			svgTag.parentNode.insertBefore(c, svgTag);
			svgTag.parentNode.removeChild(svgTag);
			var div = document.createElement('div');
			div.appendChild(svgTag);
			canvg(c, div.innerHTML);
		}
		return;
	}

	if (typeof target == 'string') {
		target = document.getElementById(target);
	}

	// store class on canvas
	if (target.svg != null) target.svg.stop();
	var svg = build(opts || {});
	// on i.e. 8 for flash canvas, we can't assign the property so check for it
	if (!(target.childNodes.length == 1 && target.childNodes[0].nodeName == 'OBJECT')) target.svg = svg;

	var ctx = target.getContext('2d');
	if (typeof s.documentElement != 'undefined') {
		// load from xml doc
		svg.loadXmlDoc(ctx, s);
	} else if (s.substr(0, 1) == '<') {
		// load from xml string
		svg.loadXml(ctx, s);
	} else {
		// load from url
		svg.load(ctx, s);
	}
};

// see https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
var matchesSelector;
if (typeof Element.prototype.matches != 'undefined') {
	matchesSelector = function matchesSelector(node, selector) {
		return node.matches(selector);
	};
} else if (typeof Element.prototype.webkitMatchesSelector != 'undefined') {
	matchesSelector = function matchesSelector(node, selector) {
		return node.webkitMatchesSelector(selector);
	};
} else if (typeof Element.prototype.mozMatchesSelector != 'undefined') {
	matchesSelector = function matchesSelector(node, selector) {
		return node.mozMatchesSelector(selector);
	};
} else if (typeof Element.prototype.msMatchesSelector != 'undefined') {
	matchesSelector = function matchesSelector(node, selector) {
		return node.msMatchesSelector(selector);
	};
} else if (typeof Element.prototype.oMatchesSelector != 'undefined') {
	matchesSelector = function matchesSelector(node, selector) {
		return node.oMatchesSelector(selector);
	};
} else {
	// requires Sizzle: https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
	// or jQuery: http://jquery.com/download/
	// or Zepto: http://zeptojs.com/#
	// without it, this is a ReferenceError

	if (typeof jQuery === 'function' || typeof Zepto === 'function') {
		matchesSelector = function matchesSelector(node, selector) {
			return $(node).is(selector);
		};
	}

	if (typeof matchesSelector === 'undefined') {
		matchesSelector = Sizzle.matchesSelector;
	}
}

// slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
var attributeRegex = /(\[[^\]]+\])/g;
var idRegex = /(#[^\s\+>~\.\[:]+)/g;
var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
var pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi;
var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
var elementRegex = /([^\s\+>~\.\[:]+)/g;

function getSelectorSpecificity(selector) {
	var typeCount = [0, 0, 0];
	var findMatch = function findMatch(regex, type) {
		var matches = selector.match(regex);
		if (matches == null) {
			return;
		}
		typeCount[type] += matches.length;
		selector = selector.replace(regex, ' ');
	};

	selector = selector.replace(/:not\(([^\)]*)\)/g, '     $1 ');
	selector = selector.replace(/{[^]*/gm, ' ');
	findMatch(attributeRegex, 1);
	findMatch(idRegex, 0);
	findMatch(classRegex, 1);
	findMatch(pseudoElementRegex, 2);
	findMatch(pseudoClassWithBracketsRegex, 1);
	findMatch(pseudoClassRegex, 1);
	selector = selector.replace(/[\*\s\+>~]/g, ' ');
	selector = selector.replace(/[#\.]/g, ' ');
	findMatch(elementRegex, 2);
	return typeCount.join('');
}

function build(opts) {
	var svg = {
		opts: opts
	};

	svg.FRAMERATE = 30;
	svg.MAX_VIRTUAL_PIXELS = 30000;

	svg.log = function (msg) {};
	if (svg.opts['log'] == true && typeof console != 'undefined') {
		svg.log = function (msg) {
			console.log(msg);
		};
	}

	// globals
	svg.init = function (ctx) {
		var uniqueId = 0;
		svg.UniqueId = function () {
			uniqueId++;
			return 'canvg' + uniqueId;
		};
		svg.Definitions = {};
		svg.Styles = {};
		svg.StylesSpecificity = {};
		svg.Animations = [];
		svg.Images = [];
		svg.ctx = ctx;
		svg.ViewPort = new function () {
			this.viewPorts = [];
			this.Clear = function () {
				this.viewPorts = [];
			};
			this.SetCurrent = function (width, height) {
				this.viewPorts.push({
					width: width,
					height: height
				});
			};
			this.RemoveCurrent = function () {
				this.viewPorts.pop();
			};
			this.Current = function () {
				return this.viewPorts[this.viewPorts.length - 1];
			};
			this.width = function () {
				return this.Current().width;
			};
			this.height = function () {
				return this.Current().height;
			};
			this.ComputeSize = function (d) {
				if (d != null && typeof d == 'number') return d;
				if (d == 'x') return this.width();
				if (d == 'y') return this.height();
				return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
			};
		}();
	};
	svg.init();

	// images loaded
	svg.ImagesLoaded = function () {
		for (var i = 0; i < svg.Images.length; i++) {
			if (!svg.Images[i].loaded) return false;
		}
		return true;
	};

	// trim
	svg.trim = function (s) {
		return s.replace(/^\s+|\s+$/g, '');
	};

	// compress spaces
	svg.compressSpaces = function (s) {
		return s.replace(/[\s\r\t\n]+/gm, ' ');
	};

	// ajax
	svg.ajax = function (url) {
		var AJAX;
		if (window.XMLHttpRequest) {
			AJAX = new XMLHttpRequest();
		} else {
			AJAX = new ActiveXObject('Microsoft.XMLHTTP');
		}
		if (AJAX) {
			AJAX.open('GET', url, false);
			AJAX.send(null);
			return AJAX.responseText;
		}
		return null;
	};

	// parse xml
	svg.parseXml = function (xml) {
		if (typeof Windows != 'undefined' && typeof Windows.Data != 'undefined' && typeof Windows.Data.Xml != 'undefined') {
			var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
			var settings = new Windows.Data.Xml.Dom.XmlLoadSettings();
			settings.prohibitDtd = false;
			xmlDoc.loadXml(xml, settings);
			return xmlDoc;
		} else if (window.DOMParser) {
			var parser = new DOMParser();
			return parser.parseFromString(xml, 'text/xml');
		} else {
			xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
			var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = 'false';
			xmlDoc.loadXML(xml);
			return xmlDoc;
		}
	};

	svg.Property = function (name, value) {
		this.name = name;
		this.value = value;
	};
	svg.Property.prototype.getValue = function () {
		return this.value;
	};

	svg.Property.prototype.hasValue = function () {
		return this.value != null && this.value !== '';
	};

	// return the numerical value of the property
	svg.Property.prototype.numValue = function () {
		if (!this.hasValue()) return 0;

		var n = parseFloat(this.value);
		if ((this.value + '').match(/%$/)) {
			n = n / 100.0;
		}
		return n;
	};

	svg.Property.prototype.valueOrDefault = function (def) {
		if (this.hasValue()) return this.value;
		return def;
	};

	svg.Property.prototype.numValueOrDefault = function (def) {
		if (this.hasValue()) return this.numValue();
		return def;
	};

	// color extensions
	// augment the current color value with the opacity
	svg.Property.prototype.addOpacity = function (opacityProp) {
		var newValue = this.value;
		if (opacityProp.value != null && opacityProp.value != '' && typeof this.value == 'string') {
			// can only add opacity to colors, not patterns
			var color = new RGBColor(this.value);
			if (color.ok) {
				newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacityProp.numValue() + ')';
			}
		}
		return new svg.Property(this.name, newValue);
	};

	// definition extensions
	// get the definition from the definitions table
	svg.Property.prototype.getDefinition = function () {
		var name = this.value.match(/#([^\)'"]+)/);
		if (name) {
			name = name[1];
		}
		if (!name) {
			name = this.value;
		}
		return svg.Definitions[name];
	};

	svg.Property.prototype.isUrlDefinition = function () {
		return this.value.indexOf('url(') == 0;
	};

	svg.Property.prototype.getFillStyleDefinition = function (e, opacityProp) {
		var def = this.getDefinition();

		// gradient
		if (def != null && def.createGradient) {
			return def.createGradient(svg.ctx, e, opacityProp);
		}

		// pattern
		if (def != null && def.createPattern) {
			if (def.getHrefAttribute().hasValue()) {
				var pt = def.attribute('patternTransform');
				def = def.getHrefAttribute().getDefinition();
				if (pt.hasValue()) {
					def.attribute('patternTransform', true).value = pt.value;
				}
			}
			return def.createPattern(svg.ctx, e);
		}

		return null;
	};

	// length extensions
	svg.Property.prototype.getDPI = function (viewPort) {
		return 96.0; // TODO: compute?
	};

	svg.Property.prototype.getEM = function (viewPort) {
		var em = 12;

		var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
		if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

		return em;
	};

	svg.Property.prototype.getUnits = function () {
		var s = this.value + '';
		return s.replace(/[0-9\.\-]/g, '');
	};

	// get the length as pixels
	svg.Property.prototype.toPixels = function (viewPort, processPercent) {
		if (!this.hasValue()) return 0;
		var s = this.value + '';
		if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
		if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
		if (s.match(/px$/)) return this.numValue();
		if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
		if (s.match(/pc$/)) return this.numValue() * 15;
		if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
		if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
		if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
		if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
		var n = this.numValue();
		if (processPercent && n < 1.0) return n * svg.ViewPort.ComputeSize(viewPort);
		return n;
	};

	// time extensions
	// get the time as milliseconds
	svg.Property.prototype.toMilliseconds = function () {
		if (!this.hasValue()) return 0;
		var s = this.value + '';
		if (s.match(/s$/)) return this.numValue() * 1000;
		if (s.match(/ms$/)) return this.numValue();
		return this.numValue();
	};

	// angle extensions
	// get the angle as radians
	svg.Property.prototype.toRadians = function () {
		if (!this.hasValue()) return 0;
		var s = this.value + '';
		if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
		if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
		if (s.match(/rad$/)) return this.numValue();
		return this.numValue() * (Math.PI / 180.0);
	};

	// text extensions
	// get the text baseline
	var textBaselineMapping = {
		'baseline': 'alphabetic',
		'before-edge': 'top',
		'text-before-edge': 'top',
		'middle': 'middle',
		'central': 'middle',
		'after-edge': 'bottom',
		'text-after-edge': 'bottom',
		'ideographic': 'ideographic',
		'alphabetic': 'alphabetic',
		'hanging': 'hanging',
		'mathematical': 'alphabetic'
	};
	svg.Property.prototype.toTextBaseline = function () {
		if (!this.hasValue()) return null;
		return textBaselineMapping[this.value];
	};

	// fonts
	svg.Font = new function () {
		this.Styles = 'normal|italic|oblique|inherit';
		this.Variants = 'normal|small-caps|inherit';
		this.Weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

		this.CreateFont = function (fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
			var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
			return {
				fontFamily: fontFamily || f.fontFamily,
				fontSize: fontSize || f.fontSize,
				fontStyle: fontStyle || f.fontStyle,
				fontWeight: fontWeight || f.fontWeight,
				fontVariant: fontVariant || f.fontVariant,
				toString: function toString() {
					return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ');
				}
			};
		};

		var that = this;
		this.Parse = function (s) {
			var f = {};
			var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
			var set = {
				fontSize: false,
				fontStyle: false,
				fontWeight: false,
				fontVariant: false
			};
			var ff = '';
			for (var i = 0; i < d.length; i++) {
				if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) {
					if (d[i] != 'inherit') f.fontStyle = d[i];
					set.fontStyle = true;
				} else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) {
					if (d[i] != 'inherit') f.fontVariant = d[i];
					set.fontStyle = set.fontVariant = true;
				} else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {
					if (d[i] != 'inherit') f.fontWeight = d[i];
					set.fontStyle = set.fontVariant = set.fontWeight = true;
				} else if (!set.fontSize) {
					if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0];
					set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true;
				} else {
					if (d[i] != 'inherit') ff += d[i];
				}
			}
			if (ff != '') f.fontFamily = ff;
			return f;
		};
	}();

	// points and paths
	svg.ToNumberArray = function (s) {
		var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
		for (var i = 0; i < a.length; i++) {
			a[i] = parseFloat(a[i]);
		}
		return a;
	};
	svg.Point = function (x, y) {
		this.x = x;
		this.y = y;
	};
	svg.Point.prototype.angleTo = function (p) {
		return Math.atan2(p.y - this.y, p.x - this.x);
	};

	svg.Point.prototype.applyTransform = function (v) {
		var xp = this.x * v[0] + this.y * v[2] + v[4];
		var yp = this.x * v[1] + this.y * v[3] + v[5];
		this.x = xp;
		this.y = yp;
	};

	svg.CreatePoint = function (s) {
		var a = svg.ToNumberArray(s);
		return new svg.Point(a[0], a[1]);
	};
	svg.CreatePath = function (s) {
		var a = svg.ToNumberArray(s);
		var path = [];
		for (var i = 0; i < a.length; i += 2) {
			path.push(new svg.Point(a[i], a[i + 1]));
		}
		return path;
	};

	// bounding box
	svg.BoundingBox = function (x1, y1, x2, y2) {
		// pass in initial points if you want
		this.x1 = Number.NaN;
		this.y1 = Number.NaN;
		this.x2 = Number.NaN;
		this.y2 = Number.NaN;

		this.x = function () {
			return this.x1;
		};
		this.y = function () {
			return this.y1;
		};
		this.width = function () {
			return this.x2 - this.x1;
		};
		this.height = function () {
			return this.y2 - this.y1;
		};

		this.addPoint = function (x, y) {
			if (x != null) {
				if (isNaN(this.x1) || isNaN(this.x2)) {
					this.x1 = x;
					this.x2 = x;
				}
				if (x < this.x1) this.x1 = x;
				if (x > this.x2) this.x2 = x;
			}

			if (y != null) {
				if (isNaN(this.y1) || isNaN(this.y2)) {
					this.y1 = y;
					this.y2 = y;
				}
				if (y < this.y1) this.y1 = y;
				if (y > this.y2) this.y2 = y;
			}
		};
		this.addX = function (x) {
			this.addPoint(x, null);
		};
		this.addY = function (y) {
			this.addPoint(null, y);
		};

		this.addBoundingBox = function (bb) {
			this.addPoint(bb.x1, bb.y1);
			this.addPoint(bb.x2, bb.y2);
		};

		this.addQuadraticCurve = function (p0x, p0y, p1x, p1y, p2x, p2y) {
			var cp1x = p0x + 2 / 3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
			var cp1y = p0y + 2 / 3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
			var cp2x = cp1x + 1 / 3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
			var cp2y = cp1y + 1 / 3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
			this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
		};

		this.addBezierCurve = function (p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
			// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
			var p0 = [p0x, p0y],
			    p1 = [p1x, p1y],
			    p2 = [p2x, p2y],
			    p3 = [p3x, p3y];
			this.addPoint(p0[0], p0[1]);
			this.addPoint(p3[0], p3[1]);

			for (i = 0; i <= 1; i++) {
				var f = function f(t) {
					return Math.pow(1 - t, 3) * p0[i] + 3 * Math.pow(1 - t, 2) * t * p1[i] + 3 * (1 - t) * Math.pow(t, 2) * p2[i] + Math.pow(t, 3) * p3[i];
				};

				var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
				var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
				var c = 3 * p1[i] - 3 * p0[i];

				if (a == 0) {
					if (b == 0) continue;
					var t = -c / b;
					if (0 < t && t < 1) {
						if (i == 0) this.addX(f(t));
						if (i == 1) this.addY(f(t));
					}
					continue;
				}

				var b2ac = Math.pow(b, 2) - 4 * c * a;
				if (b2ac < 0) continue;
				var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
				if (0 < t1 && t1 < 1) {
					if (i == 0) this.addX(f(t1));
					if (i == 1) this.addY(f(t1));
				}
				var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
				if (0 < t2 && t2 < 1) {
					if (i == 0) this.addX(f(t2));
					if (i == 1) this.addY(f(t2));
				}
			}
		};

		this.isPointInBox = function (x, y) {
			return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2;
		};

		this.addPoint(x1, y1);
		this.addPoint(x2, y2);
	};

	// transforms
	svg.Transform = function (v) {
		var that = this;
		this.Type = {};

		// translate
		this.Type.translate = function (s) {
			this.p = svg.CreatePoint(s);
			this.apply = function (ctx) {
				ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
			};
			this.unapply = function (ctx) {
				ctx.translate(-1.0 * this.p.x || 0.0, -1.0 * this.p.y || 0.0);
			};
			this.applyToPoint = function (p) {
				p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
			};
		};

		// rotate
		this.Type.rotate = function (s) {
			var a = svg.ToNumberArray(s);
			this.angle = new svg.Property('angle', a[0]);
			this.cx = a[1] || 0;
			this.cy = a[2] || 0;
			this.apply = function (ctx) {
				ctx.translate(this.cx, this.cy);
				ctx.rotate(this.angle.toRadians());
				ctx.translate(-this.cx, -this.cy);
			};
			this.unapply = function (ctx) {
				ctx.translate(this.cx, this.cy);
				ctx.rotate(-1.0 * this.angle.toRadians());
				ctx.translate(-this.cx, -this.cy);
			};
			this.applyToPoint = function (p) {
				var a = this.angle.toRadians();
				p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
				p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
			};
		};

		this.Type.scale = function (s) {
			this.p = svg.CreatePoint(s);
			this.apply = function (ctx) {
				ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
			};
			this.unapply = function (ctx) {
				ctx.scale(1.0 / this.p.x || 1.0, 1.0 / this.p.y || this.p.x || 1.0);
			};
			this.applyToPoint = function (p) {
				p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
			};
		};

		this.Type.matrix = function (s) {
			this.m = svg.ToNumberArray(s);
			this.apply = function (ctx) {
				ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
			};
			this.unapply = function (ctx) {
				var a = this.m[0];
				var b = this.m[2];
				var c = this.m[4];
				var d = this.m[1];
				var e = this.m[3];
				var f = this.m[5];
				var g = 0.0;
				var h = 0.0;
				var i = 1.0;
				var det = 1 / (a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g));
				ctx.transform(det * (e * i - f * h), det * (f * g - d * i), det * (c * h - b * i), det * (a * i - c * g), det * (b * f - c * e), det * (c * d - a * f));
			};
			this.applyToPoint = function (p) {
				p.applyTransform(this.m);
			};
		};

		this.Type.SkewBase = function (s) {
			this.base = that.Type.matrix;
			this.base(s);
			this.angle = new svg.Property('angle', s);
		};
		this.Type.SkewBase.prototype = new this.Type.matrix();

		this.Type.skewX = function (s) {
			this.base = that.Type.SkewBase;
			this.base(s);
			this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
		};
		this.Type.skewX.prototype = new this.Type.SkewBase();

		this.Type.skewY = function (s) {
			this.base = that.Type.SkewBase;
			this.base(s);
			this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
		};
		this.Type.skewY.prototype = new this.Type.SkewBase();

		this.transforms = [];

		this.apply = function (ctx) {
			for (var i = 0; i < this.transforms.length; i++) {
				this.transforms[i].apply(ctx);
			}
		};

		this.unapply = function (ctx) {
			for (var i = this.transforms.length - 1; i >= 0; i--) {
				this.transforms[i].unapply(ctx);
			}
		};

		this.applyToPoint = function (p) {
			for (var i = 0; i < this.transforms.length; i++) {
				this.transforms[i].applyToPoint(p);
			}
		};

		var data = svg.trim(svg.compressSpaces(v)).replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g, ') ').split(/\s(?=[a-z])/);
		for (var i = 0; i < data.length; i++) {
			var type = svg.trim(data[i].split('(')[0]);
			var s = data[i].split('(')[1].replace(')', '');
			var transform = new this.Type[type](s);
			transform.type = type;
			this.transforms.push(transform);
		}
	};

	// aspect ratio
	svg.AspectRatio = function (ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
		// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
		aspectRatio = svg.compressSpaces(aspectRatio);
		aspectRatio = aspectRatio.replace(/^defer\s/, ''); // ignore defer
		var align = aspectRatio.split(' ')[0] || 'xMidYMid';
		var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

		// calculate scale
		var scaleX = width / desiredWidth;
		var scaleY = height / desiredHeight;
		var scaleMin = Math.min(scaleX, scaleY);
		var scaleMax = Math.max(scaleX, scaleY);
		if (meetOrSlice == 'meet') {
			desiredWidth *= scaleMin;
			desiredHeight *= scaleMin;
		}
		if (meetOrSlice == 'slice') {
			desiredWidth *= scaleMax;
			desiredHeight *= scaleMax;
		}

		refX = new svg.Property('refX', refX);
		refY = new svg.Property('refY', refY);
		if (refX.hasValue() && refY.hasValue()) {
			ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
		} else {
			// align
			if (align.match(/^xMid/) && (meetOrSlice == 'meet' && scaleMin == scaleY || meetOrSlice == 'slice' && scaleMax == scaleY)) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
			if (align.match(/YMid$/) && (meetOrSlice == 'meet' && scaleMin == scaleX || meetOrSlice == 'slice' && scaleMax == scaleX)) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
			if (align.match(/^xMax/) && (meetOrSlice == 'meet' && scaleMin == scaleY || meetOrSlice == 'slice' && scaleMax == scaleY)) ctx.translate(width - desiredWidth, 0);
			if (align.match(/YMax$/) && (meetOrSlice == 'meet' && scaleMin == scaleX || meetOrSlice == 'slice' && scaleMax == scaleX)) ctx.translate(0, height - desiredHeight);
		}

		// scale
		if (align == 'none') ctx.scale(scaleX, scaleY);else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin);else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax);

		// translate
		ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
	};

	// elements
	svg.Element = {};

	svg.EmptyProperty = new svg.Property('EMPTY', '');

	svg.Element.ElementBase = function (node) {
		this.attributes = {};
		this.styles = {};
		this.stylesSpecificity = {};
		this.children = [];

		// get or create attribute
		this.attribute = function (name, createIfNotExists) {
			var a = this.attributes[name];
			if (a != null) return a;

			if (createIfNotExists == true) {
				a = new svg.Property(name, '');
				this.attributes[name] = a;
			}
			return a || svg.EmptyProperty;
		};

		this.getHrefAttribute = function () {
			for (var a in this.attributes) {
				if (a == 'href' || a.match(/:href$/)) {
					return this.attributes[a];
				}
			}
			return svg.EmptyProperty;
		};

		// get or create style, crawls up node tree
		this.style = function (name, createIfNotExists, skipAncestors) {
			var s = this.styles[name];
			if (s != null) return s;

			var a = this.attribute(name);
			if (a != null && a.hasValue()) {
				this.styles[name] = a; // move up to me to cache
				return a;
			}

			if (skipAncestors != true) {
				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}
			}

			if (createIfNotExists == true) {
				s = new svg.Property(name, '');
				this.styles[name] = s;
			}
			return s || svg.EmptyProperty;
		};

		// base render
		this.render = function (ctx) {
			// don't render display=none
			if (this.style('display').value == 'none') return;

			// don't render visibility=hidden
			if (this.style('visibility').value == 'hidden') return;

			ctx.save();
			if (this.style('mask').hasValue()) {
				// mask
				var mask = this.style('mask').getDefinition();
				if (mask != null) mask.apply(ctx, this);
			} else if (this.style('filter').hasValue()) {
				// filter
				var filter = this.style('filter').getDefinition();
				if (filter != null) filter.apply(ctx, this);
			} else {
				this.setContext(ctx);
				this.renderChildren(ctx);
				this.clearContext(ctx);
			}
			ctx.restore();
		};

		// base set context
		this.setContext = function (ctx) {}
		// OVERRIDE ME!


		// base clear context
		;this.clearContext = function (ctx) {}
		// OVERRIDE ME!


		// base render children
		;this.renderChildren = function (ctx) {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].render(ctx);
			}
		};

		this.addChild = function (childNode, create) {
			var child = childNode;
			if (create) child = svg.CreateElement(childNode);
			child.parent = this;
			if (child.type != 'title') {
				this.children.push(child);
			}
		};

		this.addStylesFromStyleDefinition = function () {
			// add styles
			for (var selector in svg.Styles) {
				if (selector[0] != '@' && matchesSelector(node, selector)) {
					var styles = svg.Styles[selector];
					var specificity = svg.StylesSpecificity[selector];
					if (styles != null) {
						for (var name in styles) {
							var existingSpecificity = this.stylesSpecificity[name];
							if (typeof existingSpecificity == 'undefined') {
								existingSpecificity = '000';
							}
							if (specificity > existingSpecificity) {
								this.styles[name] = styles[name];
								this.stylesSpecificity[name] = specificity;
							}
						}
					}
				}
			}
		};

		if (node != null && node.nodeType == 1) {
			//ELEMENT_NODE
			// add attributes
			for (var i = 0; i < node.attributes.length; i++) {
				var attribute = node.attributes[i];
				this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value);
			}

			this.addStylesFromStyleDefinition();

			// add inline styles
			if (this.attribute('style').hasValue()) {
				var styles = this.attribute('style').value.split(';');
				for (var i = 0; i < styles.length; i++) {
					if (svg.trim(styles[i]) != '') {
						var style = styles[i].split(':');
						var name = svg.trim(style[0]);
						var value = svg.trim(style[1]);
						this.styles[name] = new svg.Property(name, value);
					}
				}
			}

			// add id
			if (this.attribute('id').hasValue()) {
				if (svg.Definitions[this.attribute('id').value] == null) {
					svg.Definitions[this.attribute('id').value] = this;
				}
			}

			// add children
			for (var i = 0; i < node.childNodes.length; i++) {
				var childNode = node.childNodes[i];
				if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				if (this.captureTextNodes && (childNode.nodeType == 3 || childNode.nodeType == 4)) {
					var text = childNode.value || childNode.text || childNode.textContent || '';
					if (svg.compressSpaces(text) != '') {
						this.addChild(new svg.Element.tspan(childNode), false); // TEXT_NODE
					}
				}
			}
		}
	};

	svg.Element.RenderedElementBase = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.setContext = function (ctx) {
			// fill
			if (this.style('fill').isUrlDefinition()) {
				var fs = this.style('fill').getFillStyleDefinition(this, this.style('fill-opacity'));
				if (fs != null) ctx.fillStyle = fs;
			} else if (this.style('fill').hasValue()) {
				var fillStyle = this.style('fill');
				if (fillStyle.value == 'currentColor') fillStyle.value = this.style('color').value;
				if (fillStyle.value != 'inherit') ctx.fillStyle = fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value;
			}
			if (this.style('fill-opacity').hasValue()) {
				var fillStyle = new svg.Property('fill', ctx.fillStyle);
				fillStyle = fillStyle.addOpacity(this.style('fill-opacity'));
				ctx.fillStyle = fillStyle.value;
			}

			// stroke
			if (this.style('stroke').isUrlDefinition()) {
				var fs = this.style('stroke').getFillStyleDefinition(this, this.style('stroke-opacity'));
				if (fs != null) ctx.strokeStyle = fs;
			} else if (this.style('stroke').hasValue()) {
				var strokeStyle = this.style('stroke');
				if (strokeStyle.value == 'currentColor') strokeStyle.value = this.style('color').value;
				if (strokeStyle.value != 'inherit') ctx.strokeStyle = strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value;
			}
			if (this.style('stroke-opacity').hasValue()) {
				var strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
				strokeStyle = strokeStyle.addOpacity(this.style('stroke-opacity'));
				ctx.strokeStyle = strokeStyle.value;
			}
			if (this.style('stroke-width').hasValue()) {
				var newLineWidth = this.style('stroke-width').toPixels();
				ctx.lineWidth = newLineWidth == 0 ? 0.001 : newLineWidth; // browsers don't respect 0
			}
			if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
			if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
			if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;
			if (this.style('stroke-dasharray').hasValue() && this.style('stroke-dasharray').value != 'none') {
				var gaps = svg.ToNumberArray(this.style('stroke-dasharray').value);
				if (typeof ctx.setLineDash != 'undefined') {
					ctx.setLineDash(gaps);
				} else if (typeof ctx.webkitLineDash != 'undefined') {
					ctx.webkitLineDash = gaps;
				} else if (typeof ctx.mozDash != 'undefined' && !(gaps.length == 1 && gaps[0] == 0)) {
					ctx.mozDash = gaps;
				}

				var offset = this.style('stroke-dashoffset').numValueOrDefault(1);
				if (typeof ctx.lineDashOffset != 'undefined') {
					ctx.lineDashOffset = offset;
				} else if (typeof ctx.webkitLineDashOffset != 'undefined') {
					ctx.webkitLineDashOffset = offset;
				} else if (typeof ctx.mozDashOffset != 'undefined') {
					ctx.mozDashOffset = offset;
				}
			}

			// font
			if (typeof ctx.font != 'undefined') {
				ctx.font = svg.Font.CreateFont(this.style('font-style').value, this.style('font-variant').value, this.style('font-weight').value, this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '', this.style('font-family').value).toString();
			}

			// transform
			if (this.style('transform', false, true).hasValue()) {
				var transform = new svg.Transform(this.style('transform', false, true).value);
				transform.apply(ctx);
			}

			// clip
			if (this.style('clip-path', false, true).hasValue()) {
				var clip = this.style('clip-path', false, true).getDefinition();
				if (clip != null) clip.apply(ctx);
			}

			// opacity
			if (this.style('opacity').hasValue()) {
				ctx.globalAlpha = this.style('opacity').numValue();
			}
		};
	};
	svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase();

	svg.Element.PathElementBase = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.path = function (ctx) {
			if (ctx != null) ctx.beginPath();
			return new svg.BoundingBox();
		};

		this.renderChildren = function (ctx) {
			this.path(ctx);
			svg.Mouse.checkPath(this, ctx);
			if (ctx.fillStyle != '') {
				if (this.style('fill-rule').valueOrDefault('inherit') != 'inherit') {
					ctx.fill(this.style('fill-rule').value);
				} else {
					ctx.fill();
				}
			}
			if (ctx.strokeStyle != '') ctx.stroke();

			var markers = this.getMarkers();
			if (markers != null) {
				if (this.style('marker-start').isUrlDefinition()) {
					var marker = this.style('marker-start').getDefinition();
					marker.render(ctx, markers[0][0], markers[0][1]);
				}
				if (this.style('marker-mid').isUrlDefinition()) {
					var marker = this.style('marker-mid').getDefinition();
					for (var i = 1; i < markers.length - 1; i++) {
						marker.render(ctx, markers[i][0], markers[i][1]);
					}
				}
				if (this.style('marker-end').isUrlDefinition()) {
					var marker = this.style('marker-end').getDefinition();
					marker.render(ctx, markers[markers.length - 1][0], markers[markers.length - 1][1]);
				}
			}
		};

		this.getBoundingBox = function () {
			return this.path();
		};

		this.getMarkers = function () {
			return null;
		};
	};
	svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase();

	// svg element
	svg.Element.svg = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseClearContext = this.clearContext;
		this.clearContext = function (ctx) {
			this.baseClearContext(ctx);
			svg.ViewPort.RemoveCurrent();
		};

		this.baseSetContext = this.setContext;
		this.setContext = function (ctx) {
			// initial values and defaults
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			ctx.lineCap = 'butt';
			ctx.lineJoin = 'miter';
			ctx.miterLimit = 4;
			if (typeof ctx.font != 'undefined' && typeof window.getComputedStyle != 'undefined') {
				ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font');
			}

			this.baseSetContext(ctx);

			// create new view port
			if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
			if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
			ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

			var width = svg.ViewPort.width();
			var height = svg.ViewPort.height();

			if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
			if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
			if (typeof this.root == 'undefined') {
				width = this.attribute('width').toPixels('x');
				height = this.attribute('height').toPixels('y');

				var x = 0;
				var y = 0;
				if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
					x = -this.attribute('refX').toPixels('x');
					y = -this.attribute('refY').toPixels('y');
				}

				if (this.attribute('overflow').valueOrDefault('hidden') != 'visible') {
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
			}
			svg.ViewPort.SetCurrent(width, height);

			// viewbox
			if (this.attribute('viewBox').hasValue()) {
				var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
				var minX = viewBox[0];
				var minY = viewBox[1];
				width = viewBox[2];
				height = viewBox[3];

				svg.AspectRatio(ctx, this.attribute('preserveAspectRatio').value, svg.ViewPort.width(), width, svg.ViewPort.height(), height, minX, minY, this.attribute('refX').value, this.attribute('refY').value);

				svg.ViewPort.RemoveCurrent();
				svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
			}
		};
	};
	svg.Element.svg.prototype = new svg.Element.RenderedElementBase();

	// rect element
	svg.Element.rect = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function (ctx) {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			var rx = this.attribute('rx').toPixels('x');
			var ry = this.attribute('ry').toPixels('y');
			if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
			if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
			rx = Math.min(rx, width / 2.0);
			ry = Math.min(ry, height / 2.0);
			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(x + rx, y);
				ctx.lineTo(x + width - rx, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + ry);
				ctx.lineTo(x + width, y + height - ry);
				ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height);
				ctx.lineTo(x + rx, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - ry);
				ctx.lineTo(x, y + ry);
				ctx.quadraticCurveTo(x, y, x + rx, y);
				ctx.closePath();
			}

			return new svg.BoundingBox(x, y, x + width, y + height);
		};
	};
	svg.Element.rect.prototype = new svg.Element.PathElementBase();

	// circle element
	svg.Element.circle = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function (ctx) {
			var cx = this.attribute('cx').toPixels('x');
			var cy = this.attribute('cy').toPixels('y');
			var r = this.attribute('r').toPixels();

			if (ctx != null) {
				ctx.beginPath();
				ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
				ctx.closePath();
			}

			return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
		};
	};
	svg.Element.circle.prototype = new svg.Element.PathElementBase();

	// ellipse element
	svg.Element.ellipse = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.path = function (ctx) {
			var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
			var rx = this.attribute('rx').toPixels('x');
			var ry = this.attribute('ry').toPixels('y');
			var cx = this.attribute('cx').toPixels('x');
			var cy = this.attribute('cy').toPixels('y');

			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(cx, cy - ry);
				ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
				ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
				ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
				ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
				ctx.closePath();
			}

			return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
		};
	};
	svg.Element.ellipse.prototype = new svg.Element.PathElementBase();

	// line element
	svg.Element.line = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.getPoints = function () {
			return [new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')), new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
		};

		this.path = function (ctx) {
			var points = this.getPoints();

			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(points[0].x, points[0].y);
				ctx.lineTo(points[1].x, points[1].y);
			}

			return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
		};

		this.getMarkers = function () {
			var points = this.getPoints();
			var a = points[0].angleTo(points[1]);
			return [[points[0], a], [points[1], a]];
		};
	};
	svg.Element.line.prototype = new svg.Element.PathElementBase();

	// polyline element
	svg.Element.polyline = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		this.points = svg.CreatePath(this.attribute('points').value);
		this.path = function (ctx) {
			var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
			if (ctx != null) {
				ctx.beginPath();
				ctx.moveTo(this.points[0].x, this.points[0].y);
			}
			for (var i = 1; i < this.points.length; i++) {
				bb.addPoint(this.points[i].x, this.points[i].y);
				if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
			}
			return bb;
		};

		this.getMarkers = function () {
			var markers = [];
			for (var i = 0; i < this.points.length - 1; i++) {
				markers.push([this.points[i], this.points[i].angleTo(this.points[i + 1])]);
			}
			markers.push([this.points[this.points.length - 1], markers[markers.length - 1][1]]);
			return markers;
		};
	};
	svg.Element.polyline.prototype = new svg.Element.PathElementBase();

	// polygon element
	svg.Element.polygon = function (node) {
		this.base = svg.Element.polyline;
		this.base(node);

		this.basePath = this.path;
		this.path = function (ctx) {
			var bb = this.basePath(ctx);
			if (ctx != null) {
				ctx.lineTo(this.points[0].x, this.points[0].y);
				ctx.closePath();
			}
			return bb;
		};
	};
	svg.Element.polygon.prototype = new svg.Element.polyline();

	// path element
	svg.Element.path = function (node) {
		this.base = svg.Element.PathElementBase;
		this.base(node);

		var d = this.attribute('d').value;
		// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
		d = d.replace(/,/gm, ' '); // get rid of all commas
		// As the end of a match can also be the start of the next match, we need to run this replace twice.
		for (var i = 0; i < 2; i++) {
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2');
		} // suffix commands with spaces
		d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // prefix commands with spaces
		d = d.replace(/([0-9])([+\-])/gm, '$1 $2'); // separate digits on +- signs
		// Again, we need to run this twice to find all occurances
		for (var i = 0; i < 2; i++) {
			d = d.replace(/(\.[0-9]*)(\.)/gm, '$1 $2');
		} // separate digits when they start with a comma
		d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax
		d = svg.compressSpaces(d); // compress multiple spaces
		d = svg.trim(d);
		this.PathParser = new function (d) {
			this.tokens = d.split(' ');

			this.reset = function () {
				this.i = -1;
				this.command = '';
				this.previousCommand = '';
				this.start = new svg.Point(0, 0);
				this.control = new svg.Point(0, 0);
				this.current = new svg.Point(0, 0);
				this.points = [];
				this.angles = [];
			};

			this.isEnd = function () {
				return this.i >= this.tokens.length - 1;
			};

			this.isCommandOrEnd = function () {
				if (this.isEnd()) return true;
				return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
			};

			this.isRelativeCommand = function () {
				switch (this.command) {
					case 'm':
					case 'l':
					case 'h':
					case 'v':
					case 'c':
					case 's':
					case 'q':
					case 't':
					case 'a':
					case 'z':
						return true;
						break;
				}
				return false;
			};

			this.getToken = function () {
				this.i++;
				return this.tokens[this.i];
			};

			this.getScalar = function () {
				return parseFloat(this.getToken());
			};

			this.nextCommand = function () {
				this.previousCommand = this.command;
				this.command = this.getToken();
			};

			this.getPoint = function () {
				var p = new svg.Point(this.getScalar(), this.getScalar());
				return this.makeAbsolute(p);
			};

			this.getAsControlPoint = function () {
				var p = this.getPoint();
				this.control = p;
				return p;
			};

			this.getAsCurrentPoint = function () {
				var p = this.getPoint();
				this.current = p;
				return p;
			};

			this.getReflectedControlPoint = function () {
				if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's' && this.previousCommand.toLowerCase() != 'q' && this.previousCommand.toLowerCase() != 't') {
					return this.current;
				}

				// reflect point
				var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
				return p;
			};

			this.makeAbsolute = function (p) {
				if (this.isRelativeCommand()) {
					p.x += this.current.x;
					p.y += this.current.y;
				}
				return p;
			};

			this.addMarker = function (p, from, priorTo) {
				// if the last angle isn't filled in because we didn't have this point yet ...
				if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length - 1] == null) {
					this.angles[this.angles.length - 1] = this.points[this.points.length - 1].angleTo(priorTo);
				}
				this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
			};

			this.addMarkerAngle = function (p, a) {
				this.points.push(p);
				this.angles.push(a);
			};

			this.getMarkerPoints = function () {
				return this.points;
			};
			this.getMarkerAngles = function () {
				for (var i = 0; i < this.angles.length; i++) {
					if (this.angles[i] == null) {
						for (var j = i + 1; j < this.angles.length; j++) {
							if (this.angles[j] != null) {
								this.angles[i] = this.angles[j];
								break;
							}
						}
					}
				}
				return this.angles;
			};
		}(d);

		this.path = function (ctx) {
			var pp = this.PathParser;
			pp.reset();

			var bb = new svg.BoundingBox();
			if (ctx != null) ctx.beginPath();
			while (!pp.isEnd()) {
				pp.nextCommand();
				switch (pp.command) {
					case 'M':
					case 'm':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
					case 'l':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
					case 'h':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
					case 'v':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
					case 'c':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
					case 's':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
					case 'q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
					case 't':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
					case 'a':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0, -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0);
							// adjust radii
							var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(currp.y, 2) - Math.pow(ry, 2) * Math.pow(currp.x, 2)) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point((curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
							// vector magnitude
							var m = function m(v) {
								return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
							};
							// ratio between two vectors
							var r = function r(u, v) {
								return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v));
							};
							// angle between two vectors
							var a = function a(u, v) {
								return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v));
							};
							// initial angle
							var a1 = a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
							// angle delta
							var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
							var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
							var ad = a(u, v);
							if (r(u, v) <= -1) ad = Math.PI;
							if (r(u, v) >= 1) ad = 0;

							// for markers
							var dir = 1 - sweepFlag ? 1.0 : -1.0;
							var ah = a1 + dir * (ad / 2.0);
							var halfWay = new svg.Point(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah));
							pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
							pp.addMarkerAngle(cp, ah - dir * Math.PI);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1 / sx, 1 / sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
					case 'z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
				}
			}

			return bb;
		};

		this.getMarkers = function () {
			var points = this.PathParser.getMarkerPoints();
			var angles = this.PathParser.getMarkerAngles();

			var markers = [];
			for (var i = 0; i < points.length; i++) {
				markers.push([points[i], angles[i]]);
			}
			return markers;
		};
	};
	svg.Element.path.prototype = new svg.Element.PathElementBase();

	// pattern element
	svg.Element.pattern = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.createPattern = function (ctx, element) {
			var width = this.attribute('width').toPixels('x', true);
			var height = this.attribute('height').toPixels('y', true);

			// render me using a temporary svg element
			var tempSvg = new svg.Element.svg();
			tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
			tempSvg.attributes['width'] = new svg.Property('width', width + 'px');
			tempSvg.attributes['height'] = new svg.Property('height', height + 'px');
			tempSvg.attributes['transform'] = new svg.Property('transform', this.attribute('patternTransform').value);
			tempSvg.children = this.children;

			var c = document.createElement('canvas');
			c.width = width;
			c.height = height;
			var cctx = c.getContext('2d');
			if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
				cctx.translate(this.attribute('x').toPixels('x', true), this.attribute('y').toPixels('y', true));
			}
			// render 3x3 grid so when we transform there's no white space on edges
			for (var x = -1; x <= 1; x++) {
				for (var y = -1; y <= 1; y++) {
					cctx.save();
					tempSvg.attributes['x'] = new svg.Property('x', x * c.width);
					tempSvg.attributes['y'] = new svg.Property('y', y * c.height);
					tempSvg.render(cctx);
					cctx.restore();
				}
			}
			var pattern = ctx.createPattern(c, 'repeat');
			return pattern;
		};
	};
	svg.Element.pattern.prototype = new svg.Element.ElementBase();

	// marker element
	svg.Element.marker = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.baseRender = this.render;
		this.render = function (ctx, point, angle) {
			ctx.translate(point.x, point.y);
			if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
			if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
			ctx.save();

			// render me using a temporary svg element
			var tempSvg = new svg.Element.svg();
			tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
			tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
			tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
			tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
			tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
			tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
			tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
			tempSvg.children = this.children;
			tempSvg.render(ctx);

			ctx.restore();
			if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
			if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
			ctx.translate(-point.x, -point.y);
		};
	};
	svg.Element.marker.prototype = new svg.Element.ElementBase();

	// definitions element
	svg.Element.defs = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.render = function (ctx) {
			// NOOP
		};
	};
	svg.Element.defs.prototype = new svg.Element.ElementBase();

	// base for gradients
	svg.Element.GradientBase = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.stops = [];
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.type == 'stop') this.stops.push(child);
		}

		this.getGradient = function () {
			// OVERRIDE ME!
		};

		this.gradientUnits = function () {
			return this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
		};

		this.attributesToInherit = ['gradientUnits'];

		this.inheritStopContainer = function (stopsContainer) {
			for (var i = 0; i < this.attributesToInherit.length; i++) {
				var attributeToInherit = this.attributesToInherit[i];
				if (!this.attribute(attributeToInherit).hasValue() && stopsContainer.attribute(attributeToInherit).hasValue()) {
					this.attribute(attributeToInherit, true).value = stopsContainer.attribute(attributeToInherit).value;
				}
			}
		};

		this.createGradient = function (ctx, element, parentOpacityProp) {
			var stopsContainer = this;
			if (this.getHrefAttribute().hasValue()) {
				stopsContainer = this.getHrefAttribute().getDefinition();
				this.inheritStopContainer(stopsContainer);
			}

			var addParentOpacity = function addParentOpacity(color) {
				if (parentOpacityProp.hasValue()) {
					var p = new svg.Property('color', color);
					return p.addOpacity(parentOpacityProp).value;
				}
				return color;
			};

			var g = this.getGradient(ctx, element);
			if (g == null) return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
			for (var i = 0; i < stopsContainer.stops.length; i++) {
				g.addColorStop(stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color));
			}

			if (this.attribute('gradientTransform').hasValue()) {
				// render as transformed pattern on temporary canvas
				var rootView = svg.ViewPort.viewPorts[0];

				var rect = new svg.Element.rect();
				rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS / 3.0);
				rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS / 3.0);
				rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
				rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

				var group = new svg.Element.g();
				group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
				group.children = [rect];

				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['x'] = new svg.Property('x', 0);
				tempSvg.attributes['y'] = new svg.Property('y', 0);
				tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
				tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
				tempSvg.children = [group];

				var c = document.createElement('canvas');
				c.width = rootView.width;
				c.height = rootView.height;
				var tempCtx = c.getContext('2d');
				tempCtx.fillStyle = g;
				tempSvg.render(tempCtx);
				return tempCtx.createPattern(c, 'no-repeat');
			}

			return g;
		};
	};
	svg.Element.GradientBase.prototype = new svg.Element.ElementBase();

	// linear gradient element
	svg.Element.linearGradient = function (node) {
		this.base = svg.Element.GradientBase;
		this.base(node);

		this.attributesToInherit.push('x1');
		this.attributesToInherit.push('y1');
		this.attributesToInherit.push('x2');
		this.attributesToInherit.push('y2');

		this.getGradient = function (ctx, element) {
			var bb = this.gradientUnits() == 'objectBoundingBox' ? element.getBoundingBox() : null;

			if (!this.attribute('x1').hasValue() && !this.attribute('y1').hasValue() && !this.attribute('x2').hasValue() && !this.attribute('y2').hasValue()) {
				this.attribute('x1', true).value = 0;
				this.attribute('y1', true).value = 0;
				this.attribute('x2', true).value = 1;
				this.attribute('y2', true).value = 0;
			}

			var x1 = this.gradientUnits() == 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('x1').numValue() : this.attribute('x1').toPixels('x');
			var y1 = this.gradientUnits() == 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('y1').numValue() : this.attribute('y1').toPixels('y');
			var x2 = this.gradientUnits() == 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('x2').numValue() : this.attribute('x2').toPixels('x');
			var y2 = this.gradientUnits() == 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('y2').numValue() : this.attribute('y2').toPixels('y');

			if (x1 == x2 && y1 == y2) return null;
			return ctx.createLinearGradient(x1, y1, x2, y2);
		};
	};
	svg.Element.linearGradient.prototype = new svg.Element.GradientBase();

	// radial gradient element
	svg.Element.radialGradient = function (node) {
		this.base = svg.Element.GradientBase;
		this.base(node);

		this.attributesToInherit.push('cx');
		this.attributesToInherit.push('cy');
		this.attributesToInherit.push('r');
		this.attributesToInherit.push('fx');
		this.attributesToInherit.push('fy');

		this.getGradient = function (ctx, element) {
			var bb = element.getBoundingBox();

			if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
			if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
			if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

			var cx = this.gradientUnits() == 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('cx').numValue() : this.attribute('cx').toPixels('x');
			var cy = this.gradientUnits() == 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('cy').numValue() : this.attribute('cy').toPixels('y');

			var fx = cx;
			var fy = cy;
			if (this.attribute('fx').hasValue()) {
				fx = this.gradientUnits() == 'objectBoundingBox' ? bb.x() + bb.width() * this.attribute('fx').numValue() : this.attribute('fx').toPixels('x');
			}
			if (this.attribute('fy').hasValue()) {
				fy = this.gradientUnits() == 'objectBoundingBox' ? bb.y() + bb.height() * this.attribute('fy').numValue() : this.attribute('fy').toPixels('y');
			}

			var r = this.gradientUnits() == 'objectBoundingBox' ? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue() : this.attribute('r').toPixels();

			return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
		};
	};
	svg.Element.radialGradient.prototype = new svg.Element.GradientBase();

	// gradient stop element
	svg.Element.stop = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.offset = this.attribute('offset').numValue();
		if (this.offset < 0) this.offset = 0;
		if (this.offset > 1) this.offset = 1;

		var stopColor = this.style('stop-color', true);
		if (stopColor.value === '') stopColor.value = '#000';
		if (this.style('stop-opacity').hasValue()) stopColor = stopColor.addOpacity(this.style('stop-opacity'));
		this.color = stopColor.value;
	};
	svg.Element.stop.prototype = new svg.Element.ElementBase();

	// animation base element
	svg.Element.AnimateBase = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		svg.Animations.push(this);

		this.duration = 0.0;
		this.begin = this.attribute('begin').toMilliseconds();
		this.maxDuration = this.begin + this.attribute('dur').toMilliseconds();

		this.getProperty = function () {
			var attributeType = this.attribute('attributeType').value;
			var attributeName = this.attribute('attributeName').value;

			if (attributeType == 'CSS') {
				return this.parent.style(attributeName, true);
			}
			return this.parent.attribute(attributeName, true);
		};

		this.initialValue = null;
		this.initialUnits = '';
		this.removed = false;

		this.calcValue = function () {
			// OVERRIDE ME!
			return '';
		};

		this.update = function (delta) {
			// set initial value
			if (this.initialValue == null) {
				this.initialValue = this.getProperty().value;
				this.initialUnits = this.getProperty().getUnits();
			}

			// if we're past the end time
			if (this.duration > this.maxDuration) {
				// loop for indefinitely repeating animations
				if (this.attribute('repeatCount').value == 'indefinite' || this.attribute('repeatDur').value == 'indefinite') {
					this.duration = 0.0;
				} else if (this.attribute('fill').valueOrDefault('remove') == 'freeze' && !this.frozen) {
					this.frozen = true;
					this.parent.animationFrozen = true;
					this.parent.animationFrozenValue = this.getProperty().value;
				} else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
					this.removed = true;
					this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue;
					return true;
				}
				return false;
			}
			this.duration = this.duration + delta;

			// if we're past the begin time
			var updated = false;
			if (this.begin < this.duration) {
				var newValue = this.calcValue(); // tween

				if (this.attribute('type').hasValue()) {
					// for transform, etc.
					var type = this.attribute('type').value;
					newValue = type + '(' + newValue + ')';
				}

				this.getProperty().value = newValue;
				updated = true;
			}

			return updated;
		};

		this.from = this.attribute('from');
		this.to = this.attribute('to');
		this.values = this.attribute('values');
		if (this.values.hasValue()) this.values.value = this.values.value.split(';');

		// fraction of duration we've covered
		this.progress = function () {
			var ret = {
				progress: (this.duration - this.begin) / (this.maxDuration - this.begin)
			};
			if (this.values.hasValue()) {
				var p = ret.progress * (this.values.value.length - 1);
				var lb = Math.floor(p),
				    ub = Math.ceil(p);
				ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
				ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
				ret.progress = (p - lb) / (ub - lb);
			} else {
				ret.from = this.from;
				ret.to = this.to;
			}
			return ret;
		};
	};
	svg.Element.AnimateBase.prototype = new svg.Element.ElementBase();

	// animate element
	svg.Element.animate = function (node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function () {
			var p = this.progress();

			// tween value linearly
			var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
			return newValue + this.initialUnits;
		};
	};
	svg.Element.animate.prototype = new svg.Element.AnimateBase();

	// animate color element
	svg.Element.animateColor = function (node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function () {
			var p = this.progress();
			var from = new RGBColor(p.from.value);
			var to = new RGBColor(p.to.value);

			if (from.ok && to.ok) {
				// tween color linearly
				var r = from.r + (to.r - from.r) * p.progress;
				var g = from.g + (to.g - from.g) * p.progress;
				var b = from.b + (to.b - from.b) * p.progress;
				return 'rgb(' + parseInt(r, 10) + ',' + parseInt(g, 10) + ',' + parseInt(b, 10) + ')';
			}
			return this.attribute('from').value;
		};
	};
	svg.Element.animateColor.prototype = new svg.Element.AnimateBase();

	// animate transform element
	svg.Element.animateTransform = function (node) {
		this.base = svg.Element.AnimateBase;
		this.base(node);

		this.calcValue = function () {
			var p = this.progress();

			// tween value linearly
			var from = svg.ToNumberArray(p.from.value);
			var to = svg.ToNumberArray(p.to.value);
			var newValue = '';
			for (var i = 0; i < from.length; i++) {
				newValue += from[i] + (to[i] - from[i]) * p.progress + ' ';
			}
			return newValue;
		};
	};
	svg.Element.animateTransform.prototype = new svg.Element.animate();

	// font element
	svg.Element.font = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.horizAdvX = this.attribute('horiz-adv-x').numValue();

		this.isRTL = false;
		this.isArabic = false;
		this.fontFace = null;
		this.missingGlyph = null;
		this.glyphs = [];
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.type == 'font-face') {
				this.fontFace = child;
				if (child.style('font-family').hasValue()) {
					svg.Definitions[child.style('font-family').value] = this;
				}
			} else if (child.type == 'missing-glyph') this.missingGlyph = child;else if (child.type == 'glyph') {
				if (child.arabicForm != '') {
					this.isRTL = true;
					this.isArabic = true;
					if (typeof this.glyphs[child.unicode] == 'undefined') this.glyphs[child.unicode] = [];
					this.glyphs[child.unicode][child.arabicForm] = child;
				} else {
					this.glyphs[child.unicode] = child;
				}
			}
		}
	};
	svg.Element.font.prototype = new svg.Element.ElementBase();

	// font-face element
	svg.Element.fontface = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.ascent = this.attribute('ascent').value;
		this.descent = this.attribute('descent').value;
		this.unitsPerEm = this.attribute('units-per-em').numValue();
	};
	svg.Element.fontface.prototype = new svg.Element.ElementBase();

	// missing-glyph element
	svg.Element.missingglyph = function (node) {
		this.base = svg.Element.path;
		this.base(node);

		this.horizAdvX = 0;
	};
	svg.Element.missingglyph.prototype = new svg.Element.path();

	// glyph element
	svg.Element.glyph = function (node) {
		this.base = svg.Element.path;
		this.base(node);

		this.horizAdvX = this.attribute('horiz-adv-x').numValue();
		this.unicode = this.attribute('unicode').value;
		this.arabicForm = this.attribute('arabic-form').value;
	};
	svg.Element.glyph.prototype = new svg.Element.path();

	// text element
	svg.Element.text = function (node) {
		this.captureTextNodes = true;
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseSetContext = this.setContext;
		this.setContext = function (ctx) {
			this.baseSetContext(ctx);

			var textBaseline = this.style('dominant-baseline').toTextBaseline();
			if (textBaseline == null) textBaseline = this.style('alignment-baseline').toTextBaseline();
			if (textBaseline != null) ctx.textBaseline = textBaseline;
		};

		this.getBoundingBox = function () {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
			return new svg.BoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
		};

		this.renderChildren = function (ctx) {
			this.x = this.attribute('x').toPixels('x');
			this.y = this.attribute('y').toPixels('y');
			if (this.attribute('dx').hasValue()) this.x += this.attribute('dx').toPixels('x');
			if (this.attribute('dy').hasValue()) this.y += this.attribute('dy').toPixels('y');
			this.x += this.getAnchorDelta(ctx, this, 0);
			for (var i = 0; i < this.children.length; i++) {
				this.renderChild(ctx, this, i);
			}
		};

		this.getAnchorDelta = function (ctx, parent, startI) {
			var textAnchor = this.style('text-anchor').valueOrDefault('start');
			if (textAnchor != 'start') {
				var width = 0;
				for (var i = startI; i < parent.children.length; i++) {
					var child = parent.children[i];
					if (i > startI && child.attribute('x').hasValue()) break; // new group
					width += child.measureTextRecursive(ctx);
				}
				return -1 * (textAnchor == 'end' ? width : width / 2.0);
			}
			return 0;
		};

		this.renderChild = function (ctx, parent, i) {
			var child = parent.children[i];
			if (child.attribute('x').hasValue()) {
				child.x = child.attribute('x').toPixels('x') + parent.getAnchorDelta(ctx, parent, i);
				if (child.attribute('dx').hasValue()) child.x += child.attribute('dx').toPixels('x');
			} else {
				if (child.attribute('dx').hasValue()) parent.x += child.attribute('dx').toPixels('x');
				child.x = parent.x;
			}
			parent.x = child.x + child.measureText(ctx);

			if (child.attribute('y').hasValue()) {
				child.y = child.attribute('y').toPixels('y');
				if (child.attribute('dy').hasValue()) child.y += child.attribute('dy').toPixels('y');
			} else {
				if (child.attribute('dy').hasValue()) parent.y += child.attribute('dy').toPixels('y');
				child.y = parent.y;
			}
			parent.y = child.y;

			child.render(ctx);

			for (var i = 0; i < child.children.length; i++) {
				parent.renderChild(ctx, child, i);
			}
		};
	};
	svg.Element.text.prototype = new svg.Element.RenderedElementBase();

	// text base
	svg.Element.TextElementBase = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.getGlyph = function (font, text, i) {
			var c = text[i];
			var glyph = null;
			if (font.isArabic) {
				var arabicForm = 'isolated';
				if ((i == 0 || text[i - 1] == ' ') && i < text.length - 2 && text[i + 1] != ' ') arabicForm = 'terminal';
				if (i > 0 && text[i - 1] != ' ' && i < text.length - 2 && text[i + 1] != ' ') arabicForm = 'medial';
				if (i > 0 && text[i - 1] != ' ' && (i == text.length - 1 || text[i + 1] == ' ')) arabicForm = 'initial';
				if (typeof font.glyphs[c] != 'undefined') {
					glyph = font.glyphs[c][arabicForm];
					if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
				}
			} else {
				glyph = font.glyphs[c];
			}
			if (glyph == null) glyph = font.missingGlyph;
			return glyph;
		};

		this.renderChildren = function (ctx) {
			var customFont = this.parent.style('font-family').getDefinition();
			if (customFont != null) {
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
				var text = this.getText();
				if (customFont.isRTL) text = text.split("").reverse().join("");

				var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
				for (var i = 0; i < text.length; i++) {
					var glyph = this.getGlyph(customFont, text, i);
					var scale = fontSize / customFont.fontFace.unitsPerEm;
					ctx.translate(this.x, this.y);
					ctx.scale(scale, -scale);
					var lw = ctx.lineWidth;
					ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
					if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
					glyph.render(ctx);
					if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
					ctx.lineWidth = lw;
					ctx.scale(1 / scale, -1 / scale);
					ctx.translate(-this.x, -this.y);

					this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
					if (typeof dx[i] != 'undefined' && !isNaN(dx[i])) {
						this.x += dx[i];
					}
				}
				return;
			}

			if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
		};

		this.getText = function () {
			// OVERRIDE ME
		};

		this.measureTextRecursive = function (ctx) {
			var width = this.measureText(ctx);
			for (var i = 0; i < this.children.length; i++) {
				width += this.children[i].measureTextRecursive(ctx);
			}
			return width;
		};

		this.measureText = function (ctx) {
			var customFont = this.parent.style('font-family').getDefinition();
			if (customFont != null) {
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				var measure = 0;
				var text = this.getText();
				if (customFont.isRTL) text = text.split("").reverse().join("");
				var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
				for (var i = 0; i < text.length; i++) {
					var glyph = this.getGlyph(customFont, text, i);
					measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
					if (typeof dx[i] != 'undefined' && !isNaN(dx[i])) {
						measure += dx[i];
					}
				}
				return measure;
			}

			var textToMeasure = svg.compressSpaces(this.getText());
			if (!ctx.measureText) return textToMeasure.length * 10;

			ctx.save();
			this.setContext(ctx);
			var width = ctx.measureText(textToMeasure).width;
			ctx.restore();
			return width;
		};
	};
	svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase();

	// tspan
	svg.Element.tspan = function (node) {
		this.captureTextNodes = true;
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.text = svg.compressSpaces(node.value || node.text || node.textContent || '');
		this.getText = function () {
			// if this node has children, then they own the text
			if (this.children.length > 0) {
				return '';
			}
			return this.text;
		};
	};
	svg.Element.tspan.prototype = new svg.Element.TextElementBase();

	// tref
	svg.Element.tref = function (node) {
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.getText = function () {
			var element = this.getHrefAttribute().getDefinition();
			if (element != null) return element.children[0].getText();
		};
	};
	svg.Element.tref.prototype = new svg.Element.TextElementBase();

	// a element
	svg.Element.a = function (node) {
		this.base = svg.Element.TextElementBase;
		this.base(node);

		this.hasText = node.childNodes.length > 0;
		for (var i = 0; i < node.childNodes.length; i++) {
			if (node.childNodes[i].nodeType != 3) this.hasText = false;
		}

		// this might contain text
		this.text = this.hasText ? node.childNodes[0].value : '';
		this.getText = function () {
			return this.text;
		};

		this.baseRenderChildren = this.renderChildren;
		this.renderChildren = function (ctx) {
			if (this.hasText) {
				// render as text element
				this.baseRenderChildren(ctx);
				var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
				svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
			} else if (this.children.length > 0) {
				// render as temporary group
				var g = new svg.Element.g();
				g.children = this.children;
				g.parent = this;
				g.render(ctx);
			}
		};

		this.onclick = function () {
			window.open(this.getHrefAttribute().value);
		};

		this.onmousemove = function () {
			svg.ctx.canvas.style.cursor = 'pointer';
		};
	};
	svg.Element.a.prototype = new svg.Element.TextElementBase();

	// image element
	svg.Element.image = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		var href = this.getHrefAttribute().value;
		if (href == '') {
			return;
		}
		var isSvg = href.match(/\.svg$/);

		svg.Images.push(this);
		this.loaded = false;
		if (!isSvg) {
			this.img = document.createElement('img');
			if (svg.opts['useCORS'] == true) {
				this.img.crossOrigin = 'Anonymous';
			}
			var self = this;
			this.img.onload = function () {
				self.loaded = true;
			};
			this.img.onerror = function () {
				svg.log('ERROR: image "' + href + '" not found');
				self.loaded = true;
			};
			this.img.src = href;
		} else {
			this.img = svg.ajax(href);
			this.loaded = true;
		}

		this.renderChildren = function (ctx) {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');

			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			if (width == 0 || height == 0) return;

			ctx.save();
			if (isSvg) {
				ctx.drawSvg(this.img, x, y, width, height);
			} else {
				ctx.translate(x, y);
				svg.AspectRatio(ctx, this.attribute('preserveAspectRatio').value, width, this.img.width, height, this.img.height, 0, 0);
				ctx.drawImage(this.img, 0, 0);
			}
			ctx.restore();
		};

		this.getBoundingBox = function () {
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');
			return new svg.BoundingBox(x, y, x + width, y + height);
		};
	};
	svg.Element.image.prototype = new svg.Element.RenderedElementBase();

	// group element
	svg.Element.g = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.getBoundingBox = function () {
			var bb = new svg.BoundingBox();
			for (var i = 0; i < this.children.length; i++) {
				bb.addBoundingBox(this.children[i].getBoundingBox());
			}
			return bb;
		};
	};
	svg.Element.g.prototype = new svg.Element.RenderedElementBase();

	// symbol element
	svg.Element.symbol = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.render = function (ctx) {
			// NO RENDER
		};
	};
	svg.Element.symbol.prototype = new svg.Element.RenderedElementBase();

	// style element
	svg.Element.style = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		// text, or spaces then CDATA
		var css = '';
		for (var i = 0; i < node.childNodes.length; i++) {
			css += node.childNodes[i].data;
		}
		css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
		css = svg.compressSpaces(css); // replace whitespace
		var cssDefs = css.split('}');
		for (var i = 0; i < cssDefs.length; i++) {
			if (svg.trim(cssDefs[i]) != '') {
				var cssDef = cssDefs[i].split('{');
				var cssClasses = cssDef[0].split(',');
				var cssProps = cssDef[1].split(';');
				for (var j = 0; j < cssClasses.length; j++) {
					var cssClass = svg.trim(cssClasses[j]);
					if (cssClass != '') {
						var props = svg.Styles[cssClass] || {};
						for (var k = 0; k < cssProps.length; k++) {
							var prop = cssProps[k].indexOf(':');
							var name = cssProps[k].substr(0, prop);
							var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
							if (name != null && value != null) {
								props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
							}
						}
						svg.Styles[cssClass] = props;
						svg.StylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
						if (cssClass == '@font-face') {
							var fontFamily = props['font-family'].value.replace(/"/g, '');
							var srcs = props['src'].value.split(',');
							for (var s = 0; s < srcs.length; s++) {
								if (srcs[s].indexOf('format("svg")') > 0) {
									var urlStart = srcs[s].indexOf('url');
									var urlEnd = srcs[s].indexOf(')', urlStart);
									var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
									var doc = svg.parseXml(svg.ajax(url));
									var fonts = doc.getElementsByTagName('font');
									for (var f = 0; f < fonts.length; f++) {
										var font = svg.CreateElement(fonts[f]);
										svg.Definitions[fontFamily] = font;
									}
								}
							}
						}
					}
				}
			}
		}
	};
	svg.Element.style.prototype = new svg.Element.ElementBase();

	// use element
	svg.Element.use = function (node) {
		this.base = svg.Element.RenderedElementBase;
		this.base(node);

		this.baseSetContext = this.setContext;
		this.setContext = function (ctx) {
			this.baseSetContext(ctx);
			if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
			if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
		};

		var element = this.getHrefAttribute().getDefinition();

		this.path = function (ctx) {
			if (element != null) element.path(ctx);
		};

		this.getBoundingBox = function () {
			if (element != null) return element.getBoundingBox();
		};

		this.renderChildren = function (ctx) {
			if (element != null) {
				var tempSvg = element;
				if (element.type == 'symbol') {
					// render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
					tempSvg = new svg.Element.svg();
					tempSvg.type = 'svg';
					tempSvg.attributes['viewBox'] = new svg.Property('viewBox', element.attribute('viewBox').value);
					tempSvg.attributes['preserveAspectRatio'] = new svg.Property('preserveAspectRatio', element.attribute('preserveAspectRatio').value);
					tempSvg.attributes['overflow'] = new svg.Property('overflow', element.attribute('overflow').value);
					tempSvg.children = element.children;
				}
				if (tempSvg.type == 'svg') {
					// if symbol or svg, inherit width/height from me
					if (this.attribute('width').hasValue()) tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
					if (this.attribute('height').hasValue()) tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				}
				var oldParent = tempSvg.parent;
				tempSvg.parent = null;
				tempSvg.render(ctx);
				tempSvg.parent = oldParent;
			}
		};
	};
	svg.Element.use.prototype = new svg.Element.RenderedElementBase();

	// mask element
	svg.Element.mask = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function (ctx, element) {
			// render as temp svg
			var x = this.attribute('x').toPixels('x');
			var y = this.attribute('y').toPixels('y');
			var width = this.attribute('width').toPixels('x');
			var height = this.attribute('height').toPixels('y');

			if (width == 0 && height == 0) {
				var bb = new svg.BoundingBox();
				for (var i = 0; i < this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				var x = Math.floor(bb.x1);
				var y = Math.floor(bb.y1);
				var width = Math.floor(bb.width());
				var height = Math.floor(bb.height());
			}

			// temporarily remove mask to avoid recursion
			var mask = element.attribute('mask').value;
			element.attribute('mask').value = '';

			var cMask = document.createElement('canvas');
			cMask.width = x + width;
			cMask.height = y + height;
			var maskCtx = cMask.getContext('2d');
			this.renderChildren(maskCtx);

			var c = document.createElement('canvas');
			c.width = x + width;
			c.height = y + height;
			var tempCtx = c.getContext('2d');
			element.render(tempCtx);
			tempCtx.globalCompositeOperation = 'destination-in';
			tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
			tempCtx.fillRect(0, 0, x + width, y + height);

			ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
			ctx.fillRect(0, 0, x + width, y + height);

			// reassign mask
			element.attribute('mask').value = mask;
		};

		this.render = function (ctx) {
			// NO RENDER
		};
	};
	svg.Element.mask.prototype = new svg.Element.ElementBase();

	// clip element
	svg.Element.clipPath = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function (ctx) {
			var oldBeginPath = CanvasRenderingContext2D.prototype.beginPath;
			CanvasRenderingContext2D.prototype.beginPath = function () {};

			var oldClosePath = CanvasRenderingContext2D.prototype.closePath;
			CanvasRenderingContext2D.prototype.closePath = function () {};

			oldBeginPath.call(ctx);
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (typeof child.path != 'undefined') {
					var transform = null;
					if (child.style('transform', false, true).hasValue()) {
						transform = new svg.Transform(child.style('transform', false, true).value);
						transform.apply(ctx);
					}
					child.path(ctx);
					CanvasRenderingContext2D.prototype.closePath = oldClosePath;
					if (transform) {
						transform.unapply(ctx);
					}
				}
			}
			oldClosePath.call(ctx);
			ctx.clip();

			CanvasRenderingContext2D.prototype.beginPath = oldBeginPath;
			CanvasRenderingContext2D.prototype.closePath = oldClosePath;
		};

		this.render = function (ctx) {
			// NO RENDER
		};
	};
	svg.Element.clipPath.prototype = new svg.Element.ElementBase();

	// filters
	svg.Element.filter = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function (ctx, element) {
			// render as temp svg
			var bb = element.getBoundingBox();
			var x = Math.floor(bb.x1);
			var y = Math.floor(bb.y1);
			var width = Math.floor(bb.width());
			var height = Math.floor(bb.height());

			// temporarily remove filter to avoid recursion
			var filter = element.style('filter').value;
			element.style('filter').value = '';

			var px = 0,
			    py = 0;
			for (var i = 0; i < this.children.length; i++) {
				var efd = this.children[i].extraFilterDistance || 0;
				px = Math.max(px, efd);
				py = Math.max(py, efd);
			}

			var c = document.createElement('canvas');
			c.width = width + 2 * px;
			c.height = height + 2 * py;
			var tempCtx = c.getContext('2d');
			tempCtx.translate(-x + px, -y + py);
			element.render(tempCtx);

			// apply filters
			for (var i = 0; i < this.children.length; i++) {
				if (typeof this.children[i].apply === 'function') {
					this.children[i].apply(tempCtx, 0, 0, width + 2 * px, height + 2 * py);
				}
			}

			// render on me
			ctx.drawImage(c, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py);

			// reassign filter
			element.style('filter', true).value = filter;
		};

		this.render = function (ctx) {
			// NO RENDER
		};
	};
	svg.Element.filter.prototype = new svg.Element.ElementBase();

	svg.Element.feMorphology = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function (ctx, x, y, width, height) {
			// TODO: implement
		};
	};
	svg.Element.feMorphology.prototype = new svg.Element.ElementBase();

	svg.Element.feComposite = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.apply = function (ctx, x, y, width, height) {
			// TODO: implement
		};
	};
	svg.Element.feComposite.prototype = new svg.Element.ElementBase();

	svg.Element.feColorMatrix = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		var matrix = svg.ToNumberArray(this.attribute('values').value);
		switch (this.attribute('type').valueOrDefault('matrix')) {// http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
			case 'saturate':
				var s = matrix[0];
				matrix = [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
				break;
			case 'hueRotate':
				var a = matrix[0] * Math.PI / 180.0;
				var c = function c(m1, m2, m3) {
					return m1 + Math.cos(a) * m2 + Math.sin(a) * m3;
				};
				matrix = [c(0.213, 0.787, -0.213), c(0.715, -0.715, -0.715), c(0.072, -0.072, 0.928), 0, 0, c(0.213, -0.213, 0.143), c(0.715, 0.285, 0.140), c(0.072, -0.072, -0.283), 0, 0, c(0.213, -0.213, -0.787), c(0.715, -0.715, 0.715), c(0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
				break;
			case 'luminanceToAlpha':
				matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
				break;
		}

		function imGet(img, x, y, width, height, rgba) {
			return img[y * width * 4 + x * 4 + rgba];
		}

		function imSet(img, x, y, width, height, rgba, val) {
			img[y * width * 4 + x * 4 + rgba] = val;
		}

		function m(i, v) {
			var mi = matrix[i];
			return mi * (mi < 0 ? v - 255 : v);
		}

		this.apply = function (ctx, x, y, width, height) {
			// assuming x==0 && y==0 for now
			var srcData = ctx.getImageData(0, 0, width, height);
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					var r = imGet(srcData.data, x, y, width, height, 0);
					var g = imGet(srcData.data, x, y, width, height, 1);
					var b = imGet(srcData.data, x, y, width, height, 2);
					var a = imGet(srcData.data, x, y, width, height, 3);
					imSet(srcData.data, x, y, width, height, 0, m(0, r) + m(1, g) + m(2, b) + m(3, a) + m(4, 1));
					imSet(srcData.data, x, y, width, height, 1, m(5, r) + m(6, g) + m(7, b) + m(8, a) + m(9, 1));
					imSet(srcData.data, x, y, width, height, 2, m(10, r) + m(11, g) + m(12, b) + m(13, a) + m(14, 1));
					imSet(srcData.data, x, y, width, height, 3, m(15, r) + m(16, g) + m(17, b) + m(18, a) + m(19, 1));
				}
			}
			ctx.clearRect(0, 0, width, height);
			ctx.putImageData(srcData, 0, 0);
		};
	};
	svg.Element.feColorMatrix.prototype = new svg.Element.ElementBase();

	svg.Element.feGaussianBlur = function (node) {
		this.base = svg.Element.ElementBase;
		this.base(node);

		this.blurRadius = Math.floor(this.attribute('stdDeviation').numValue());
		this.extraFilterDistance = this.blurRadius;

		this.apply = function (ctx, x, y, width, height) {
			if (typeof stackBlur.canvasRGBA == 'undefined') {
				svg.log('ERROR: StackBlur.js must be included for blur to work');
				return;
			}

			// StackBlur requires canvas be on document
			ctx.canvas.id = svg.UniqueId();
			ctx.canvas.style.display = 'none';
			document.body.appendChild(ctx.canvas);
			stackBlur.canvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
			document.body.removeChild(ctx.canvas);
		};
	};
	svg.Element.feGaussianBlur.prototype = new svg.Element.ElementBase();

	// title element, do nothing
	svg.Element.title = function (node) {};
	svg.Element.title.prototype = new svg.Element.ElementBase();

	// desc element, do nothing
	svg.Element.desc = function (node) {};
	svg.Element.desc.prototype = new svg.Element.ElementBase();

	svg.Element.MISSING = function (node) {
		svg.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
	};
	svg.Element.MISSING.prototype = new svg.Element.ElementBase();

	// element factory
	svg.CreateElement = function (node) {
		var className = node.nodeName.replace(/^[^:]+:/, ''); // remove namespace
		className = className.replace(/\-/g, ''); // remove dashes
		var e = null;
		if (typeof svg.Element[className] != 'undefined') {
			e = new svg.Element[className](node);
		} else {
			e = new svg.Element.MISSING(node);
		}

		e.type = node.nodeName;
		return e;
	};

	// load from url
	svg.load = function (ctx, url) {
		svg.loadXml(ctx, svg.ajax(url));
	};

	// load from xml
	svg.loadXml = function (ctx, xml) {
		svg.loadXmlDoc(ctx, svg.parseXml(xml));
	};

	svg.loadXmlDoc = function (ctx, dom) {
		svg.init(ctx);

		var mapXY = function mapXY(p) {
			var e = ctx.canvas;
			while (e) {
				p.x -= e.offsetLeft;
				p.y -= e.offsetTop;
				e = e.offsetParent;
			}
			if (window.scrollX) p.x += window.scrollX;
			if (window.scrollY) p.y += window.scrollY;
			return p;
		};

		// bind mouse
		if (svg.opts['ignoreMouse'] != true) {
			ctx.canvas.onclick = function (e) {
				var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
				svg.Mouse.onclick(p.x, p.y);
			};
			ctx.canvas.onmousemove = function (e) {
				var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
				svg.Mouse.onmousemove(p.x, p.y);
			};
		}

		var e = svg.CreateElement(dom.documentElement);
		e.root = true;
		e.addStylesFromStyleDefinition();

		// render loop
		var isFirstRender = true;
		var draw = function draw() {
			svg.ViewPort.Clear();
			if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);

			if (svg.opts['ignoreDimensions'] != true) {
				// set canvas size
				if (e.style('width').hasValue()) {
					ctx.canvas.width = e.style('width').toPixels('x');
					ctx.canvas.style.width = ctx.canvas.width + 'px';
				}
				if (e.style('height').hasValue()) {
					ctx.canvas.height = e.style('height').toPixels('y');
					ctx.canvas.style.height = ctx.canvas.height + 'px';
				}
			}
			var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
			var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
			if (svg.opts['ignoreDimensions'] == true && e.style('width').hasValue() && e.style('height').hasValue()) {
				cWidth = e.style('width').toPixels('x');
				cHeight = e.style('height').toPixels('y');
			}
			svg.ViewPort.SetCurrent(cWidth, cHeight);

			if (svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
			if (svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
			if (svg.opts['scaleWidth'] != null || svg.opts['scaleHeight'] != null) {
				var xRatio = null,
				    yRatio = null,
				    viewBox = svg.ToNumberArray(e.attribute('viewBox').value);

				if (svg.opts['scaleWidth'] != null) {
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth'];else if (!isNaN(viewBox[2])) xRatio = viewBox[2] / svg.opts['scaleWidth'];
				}

				if (svg.opts['scaleHeight'] != null) {
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight'];else if (!isNaN(viewBox[3])) yRatio = viewBox[3] / svg.opts['scaleHeight'];
				}

				if (xRatio == null) {
					xRatio = yRatio;
				}
				if (yRatio == null) {
					yRatio = xRatio;
				}

				e.attribute('width', true).value = svg.opts['scaleWidth'];
				e.attribute('height', true).value = svg.opts['scaleHeight'];
				e.style('transform', true, true).value += ' scale(' + 1.0 / xRatio + ',' + 1.0 / yRatio + ')';
			}

			// clear and render
			if (svg.opts['ignoreClear'] != true) {
				ctx.clearRect(0, 0, cWidth, cHeight);
			}
			e.render(ctx);
			if (isFirstRender) {
				isFirstRender = false;
				if (typeof svg.opts['renderCallback'] == 'function') svg.opts['renderCallback'](dom);
			}
		};

		var waitingForImages = true;
		if (svg.ImagesLoaded()) {
			waitingForImages = false;
			draw();
		}
		svg.intervalID = setInterval(function () {
			var needUpdate = false;

			if (waitingForImages && svg.ImagesLoaded()) {
				waitingForImages = false;
				needUpdate = true;
			}

			// need update from mouse events?
			if (svg.opts['ignoreMouse'] != true) {
				needUpdate = needUpdate | svg.Mouse.hasEvents();
			}

			// need update from animations?
			if (svg.opts['ignoreAnimation'] != true) {
				for (var i = 0; i < svg.Animations.length; i++) {
					needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
				}
			}

			// need update from redraw?
			if (typeof svg.opts['forceRedraw'] == 'function') {
				if (svg.opts['forceRedraw']() == true) needUpdate = true;
			}

			// render if needed
			if (needUpdate) {
				draw();
				svg.Mouse.runEvents(); // run and clear our events
			}
		}, 1000 / svg.FRAMERATE);
	};

	svg.stop = function () {
		if (svg.intervalID) {
			clearInterval(svg.intervalID);
		}
	};

	svg.Mouse = new function () {
		this.events = [];
		this.hasEvents = function () {
			return this.events.length != 0;
		};

		this.onclick = function (x, y) {
			this.events.push({
				type: 'onclick',
				x: x,
				y: y,
				run: function run(e) {
					if (e.onclick) e.onclick();
				}
			});
		};

		this.onmousemove = function (x, y) {
			this.events.push({
				type: 'onmousemove',
				x: x,
				y: y,
				run: function run(e) {
					if (e.onmousemove) e.onmousemove();
				}
			});
		};

		this.eventElements = [];

		this.checkPath = function (element, ctx) {
			for (var i = 0; i < this.events.length; i++) {
				var e = this.events[i];
				if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
			}
		};

		this.checkBoundingBox = function (element, bb) {
			for (var i = 0; i < this.events.length; i++) {
				var e = this.events[i];
				if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
			}
		};

		this.runEvents = function () {
			svg.ctx.canvas.style.cursor = '';

			for (var i = 0; i < this.events.length; i++) {
				var e = this.events[i];
				var element = this.eventElements[i];
				while (element) {
					e.run(element);
					element = element.parent;
				}
			}

			// done running, clear
			this.events = [];
			this.eventElements = [];
		};
	}();

	return svg;
}

if (typeof CanvasRenderingContext2D != 'undefined') {
	CanvasRenderingContext2D.prototype.drawSvg = function (s, dx, dy, dw, dh) {
		canvg(this.canvas, s, {
			ignoreMouse: true,
			ignoreAnimation: true,
			ignoreDimensions: true,
			ignoreClear: true,
			offsetX: dx,
			offsetY: dy,
			scaleWidth: dw,
			scaleHeight: dh
		});
	};
}

function svgAImg(jqContenedor, fncallback) {

	var elsvg = jqContenedor.find('svg');

	if (elsvg.length === 0) {
		if (fncallback) {
			fncallback();
		}
		return;
	}
	jqContenedor.find('g').removeAttr('clip-path');
	jqContenedor.find('g.c3-event-rects').remove();
	jqContenedor.find('g.c3-grid').remove();
	jqContenedor.find('g.c3-regions').remove();
	jqContenedor.find('g.c3-axis-y2').remove();
	jqContenedor.find('path.domain').attr('stroke-width', 0.5).css('stroke-width', '0.2px');

	var svgData = new XMLSerializer().serializeToString(elsvg[0]);

	elsvg.hide();

	var canvas = document.createElement("canvas");
	canvas.setAttribute('id', 'elcanvas');
	jqContenedor[0].appendChild(canvas);

	canvg('elcanvas', svgData, {
		ignoreMouse: true,
		ignoreAnimation: true,
		log: true
	});

	jqContenedor.find('.laimg').remove();

	var laimg = new Image();
	laimg.className = 'laimg';
	jqContenedor[0].appendChild(laimg);
	laimg.src = canvas.toDataURL();

	jqContenedor.find('#elcanvas').remove();
	if (fncallback) {
		fncallback(laimg);
	}
	return;
}

function svgACanvas(jqContenedor, fncallback) {

	var elsvg = jqContenedor.find('svg');

	jqContenedor.find('svg').css('font', '10px sans-serif');

	jqContenedor.find('path').attr('fill', 'none');

	jqContenedor.find('.tick line, path.domain').attr('stroke', 'black');

	jqContenedor.find('canvas').remove();

	var tooltip = jqContenedor.find('.c3-tooltip-container').detach();

	var content = jqContenedor.html().trim();

	var canvas = document.createElement("canvas");
	jqContenedor[0].appendChild(canvas);

	elsvg.hide();
	jqContenedor.append(tooltip);
	canvg(canvas, content);

	if (fncallback) {
		fncallback(canvas);
	}
	return;
}

function hiddenClone(jqContenedor) {
	var clone = jqContenedor[0].cloneNode(true);

	// Position element relatively within the
	// body but still out of the viewport
	var style = clone.style;
	style.position = 'relative';
	style['box-sizing'] = 'content-box';
	style.width = jqContenedor.width() + 'px';
	style.height = jqContenedor.height() + 'px';
	style.top = window.innerHeight + 'px';
	style.left = 0;

	// Append clone to body and return the clone
	document.body.appendChild(clone);
	console.zdebug('poor clone', clone);
	return clone;
}

var infoScreenShot = function infoScreenShot(jqContenedor) {

	jqContenedor.find('.canvg').each(function () {
		svgAImg(jQuery(this));
	});

	var clone = hiddenClone(jqContenedor);

	return html2canvas(clone, {
		useCORS: true,
		allowTaint: false,
		logging: false
	}).then(function (canvas) {
		document.body.removeChild(clone);
		console.log('html2canvas done', canvas);
		jQuery('#supercontenedor').css({
			'opacity': '1'
		});
		return canvas.toDataURL("image/png");
	});
};

var ig_screenshot = {
	html2canvas: html2canvas,
	infoScreenShot: infoScreenShot,
	canvg: canvg,
	hiddenClone: hiddenClone,
	svgAImg: svgAImg,
	svgACanvas: svgACanvas
};

export { html2canvas, infoScreenShot, canvg, hiddenClone, svgAImg, svgACanvas };
export default ig_screenshot;
