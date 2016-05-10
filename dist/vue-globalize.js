/*!
 * vue-globalize v0.1.1
 * (c) 2016 Nikola Kovacs
 * Released under the MIT License.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-globalize"] = factory();
	else
		root["vue-globalize"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _util = __webpack_require__(1);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	// import Globalize from 'globalize';

	var Vue = void 0;
	var installed = false;
	var globalizeLoader = void 0;
	var defaultCategories = [];

	function wrapGlobalize(globalize) {
	    // Prevent Vue from watching the wrapper and the globalize inside it.
	    // It only needs to react when the whole object is replaced.
	    return Object.freeze({
	        globalize: globalize,
	        dateFormatterCache: {
	            date: {},
	            datetime: {},
	            time: {}
	        }
	    });
	}

	function createGlobalize(locale, categories) {
	    return new Promise(function (resolve, reject) {
	        try {
	            globalizeLoader(locale, categories, null, resolve);
	        } catch (err) {
	            reject(err);
	        }
	    });
	}

	function loadAdditionalCategories(globalize, locale, categories) {
	    return new Promise(function (resolve, reject) {
	        try {
	            globalizeLoader(locale, categories, globalize, resolve);
	        } catch (err) {
	            reject(err);
	        }
	    });
	}

	var noop = function noop(value) {
	    return value;
	};

	function augment(Vue) {
	    var currentLoaderPromise = null;
	    var vm = new Vue({
	        data: {
	            globalizeWrapper: wrapGlobalize(null),
	            locale: null,
	            categoriesInUse: defaultCategories,
	            categoriesLoaded: {}
	        },
	        computed: {
	            globalize: {
	                get: function get() {
	                    return this.globalizeWrapper.globalize;
	                },
	                set: function set(newValue) {
	                    this.globalizeWrapper = wrapGlobalize(newValue);
	                }
	            }
	        },
	        methods: {
	            dateFormatter: function dateFormatter(type, format) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                var cache = this.globalizeWrapper.dateFormatterCache;
	                if (!cache[type] || !cache[type][format]) {
	                    var options = {};
	                    options[type] = format;
	                    var formatter = this.globalize.dateFormatter(options);
	                    cache[type][format] = formatter;
	                    return formatter;
	                }
	                return cache[type][format];
	            },
	            numberFormatter: function numberFormatter(options) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                return this.globalize.numberFormatter(options);
	            },
	            currencyFormatter: function currencyFormatter(currency, options) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                return this.globalize.currencyFormatter(currency, options);
	            },
	            pluralGenerator: function pluralGenerator(options) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                return this.globalize.pluralGenerator(options);
	            },
	            relativeTimeFormatter: function relativeTimeFormatter(unit, options) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                return this.globalize.relativeTimeFormatter(unit, options);
	            },
	            unitFormatter: function unitFormatter(unit, options) {
	                if (!this.globalize) {
	                    return noop;
	                }
	                return this.globalize.unitFormatter(unit, options);
	            }
	        },
	        watch: {
	            locale: function locale(_locale, oldLocale) {
	                var _this = this;

	                if (_locale !== null) {
	                    currentLoaderPromise = new Promise(function (resolve, reject) {
	                        Promise.all([createGlobalize(_locale, _this.categoriesInUse)]).then(function (_ref) {
	                            var _ref2 = _slicedToArray(_ref, 1);

	                            var globalize = _ref2[0];

	                            _this.$set('globalize', globalize);

	                            var newCategoriesLoaded = {};
	                            for (var i = 0, l = _this.categoriesInUse.length; i < l; i++) {
	                                var category = _this.categoriesInUse[i];
	                                newCategoriesLoaded[category] = true;
	                            }
	                            vm.categoriesLoaded = newCategoriesLoaded;

	                            resolve({
	                                globalize: globalize,
	                                locale: _locale
	                            });
	                        }, function (err) {
	                            (0, _util.warn)(err);
	                            reject(err);
	                        });
	                    });
	                }
	            }
	        }
	    });

	    Vue.filter('date', function (value, format) {
	        try {
	            return vm.dateFormatter('date', format || 'medium')(new Date(value));
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('time', function (value, format) {
	        try {
	            return vm.dateFormatter('time', format || 'medium')(new Date(value));
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('datetime', function (value, format) {
	        try {
	            return vm.dateFormatter('datetime', format || 'medium')(new Date(value));
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('number', function (value, options) {
	        try {
	            return vm.numberFormatter(options || {})(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('percent', function (value, options) {
	        try {
	            options = options || {};
	            options.style = options.style || 'percent';
	            return vm.numberFormatter(options)(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('currency', function (value, currency, options) {
	        try {
	            return vm.currencyFormatter(currency, options || {})(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('plural', function (value, type) {
	        try {
	            return vm.pluralGenerator({ type: type || 'cardinal' })(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('relativeTime', function (value, unit, options) {
	        try {
	            return vm.relativeTimeFormatter(unit, options || {})(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.filter('unit', function (value, unit, options) {
	        try {
	            return vm.unitFormatter(unit, options || {})(value);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return value;
	        }
	    });

	    Vue.prototype.t = function (string, variables) {
	        if (!vm.globalize) {
	            return string;
	        }
	        try {
	            return vm.globalize.formatMessage(string, variables);
	        } catch (e) {
	            (0, _util.warn)(e);
	            return string;
	        }
	    };

	    Vue.prototype.$setLocale = function (locale) {
	        vm.locale = locale;
	    };

	    Vue.prototype.$getLocale = function () {
	        return vm.locale;
	    };

	    Vue.prototype.$getGlobalize = function () {
	        return vm.globalize;
	    };

	    Vue.prototype.$globalizeCategoryLoaded = function (category) {
	        return vm.categoriesLoaded[category] === true;
	    };

	    /**
	     * Add a category to the currently used categories. Switching locale
	     * will automatically load the currently used categories for the new locale.
	     */
	    Vue.prototype.$addGlobalizeCategory = function (category) {
	        var index = vm.categoriesInUse.indexOf(category);
	        if (index === -1) {
	            vm.categoriesInUse.push(category);
	            if (currentLoaderPromise) {
	                currentLoaderPromise.then(function (_ref3) {
	                    var globalize = _ref3.globalize;
	                    var locale = _ref3.locale;

	                    loadAdditionalCategories(globalize, locale, [category]).then(function (globalize) {
	                        vm.$set('globalize', globalize);
	                        vm.$set('categoriesLoaded.' + category, true);
	                    }, function (err) {
	                        (0, _util.warn)(err);
	                    });
	                });
	            }
	        }
	    };

	    /**
	     * Remove a category from the currently used categories.
	     * This does not actually unload the data, it only means that
	     * the category will not be automatically loaded on a locale switch.
	     */
	    Vue.prototype.$removeGlobalizeCategory = function (category) {
	        vm.categoriesInUse.$remove(category);
	    };
	}

	/**
	 * options has the following properties:
	 *  - defaultCategories: default globalize categories, always loaded for the given locale, optional, defaults to empty array
	 *  - loadGlobalize: function(locale, categories, globalize, callback), required
	 *      Loads a globalize instance for the given locale and categories.
	 *      Messages and formatters can be split into categories, and loaded
	 *      only when needed.
	 *      If globalize is not null, the additional categories should be loaded into
	 *      the existing instance, and callback should be called with the same instance.
	 *      Otherwise callback should be called with the new instance.
	 */
	var install = function install(externalVue, options) {
	    if (installed) {
	        (0, _util.warn)('already installed');
	        return;
	    }
	    options = options || {};

	    var fail = false;
	    var fns = ['loadGlobalize'];
	    for (var i = 0, l = fns.length; i < l; i++) {
	        var fn = fns[i];
	        if (typeof options[fn] !== 'function') {
	            (0, _util.warn)('missing "' + fn + '" function');
	            fail = true;
	        }
	    }
	    if (fail) {
	        return;
	    }

	    globalizeLoader = options.loadGlobalize;
	    if (options.defaultCategories) {
	        defaultCategories = options.defaultCategories;
	    }

	    Vue = externalVue;
	    _util2.default.Vue = Vue;
	    installed = true;
	    augment(Vue);
	};

	exports.default = install;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.warn = warn;
	/*** IMPORTS FROM imports-loader ***/
	var define = false;

	// export default for holding the Vue reference
	var _exports = {};
	exports.default = _exports;

	/**
	 * Warn stuff.
	 *
	 * @param {String} msg
	 */

	function warn(msg) {
	    /* istanbul ignore next */
	    if (window.console) {
	        console.warn('[vue-globalize] ' + msg);
	        /* istanbul ignore if */
	        if (!_exports.Vue || _exports.Vue.config.debug) {
	            console.warn(new Error('warning stack trace:').stack);
	        }
	    }
	}

/***/ }
/******/ ])
});
;