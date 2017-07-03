/*!
 * vue-globalize v0.2.0
 * (c) 2017 Nikola Kovacs
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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/util.js
// export default for holding the Vue reference
var exports = {};
/* harmony default export */ var util_defaultExport = (exports);

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
        if (!exports.Vue || exports.Vue.config.debug) {
            console.warn(new Error('warning stack trace:').stack);
        }
    }
}
// CONCATENATED MODULE: ./src/index.js
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();


// import Globalize from 'globalize';

var src_Vue = void 0;
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
            },
            setLocale: function setLocale(locale) {
                var _this = this;

                vm.locale = locale;
                if (locale !== null) {
                    currentLoaderPromise = new Promise(function (resolve, reject) {
                        Promise.all([createGlobalize(locale, _this.categoriesInUse)]).then(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 1),
                                globalize = _ref2[0];

                            _this.globalize = globalize;

                            var newCategoriesLoaded = {};
                            for (var i = 0, l = _this.categoriesInUse.length; i < l; i++) {
                                var category = _this.categoriesInUse[i];
                                newCategoriesLoaded[category] = true;
                            }
                            vm.categoriesLoaded = newCategoriesLoaded;

                            resolve({
                                globalize: globalize,
                                locale: locale
                            });
                        }, function (err) {
                            warn(err);
                            reject(err);
                        });
                    });
                    return currentLoaderPromise;
                }
                this.globalize = null;
                return Promise.resolve(null);
            }
        }
    });

    var dateFilter = function dateFilter(value, format) {
        try {
            return vm.dateFormatter('date', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var timeFilter = function timeFilter(value, format) {
        try {
            return vm.dateFormatter('time', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var datetimeFilter = function datetimeFilter(value, format) {
        try {
            return vm.dateFormatter('datetime', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var numberFilter = function numberFilter(value, options) {
        try {
            return vm.numberFormatter(options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var percentFilter = function percentFilter(value, options) {
        try {
            options = options || {};
            options.style = options.style || 'percent';
            return vm.numberFormatter(options)(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var currencyFilter = function currencyFilter(value, currency, options) {
        try {
            return vm.currencyFormatter(currency, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var pluralFilter = function pluralFilter(value, type) {
        try {
            return vm.pluralGenerator({ type: type || 'cardinal' })(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var relativeTimeFilter = function relativeTimeFilter(value, unit, options) {
        try {
            return vm.relativeTimeFormatter(unit, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    var unitFilter = function unitFilter(value, unit, options) {
        try {
            return vm.unitFormatter(unit, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    };

    Vue.filter('date', dateFilter);
    Vue.filter('time', timeFilter);
    Vue.filter('datetime', datetimeFilter);
    Vue.filter('number', numberFilter);
    Vue.filter('percent', percentFilter);
    Vue.filter('currency', currencyFilter);
    Vue.filter('plural', pluralFilter);
    Vue.filter('relativeTime', relativeTimeFilter);
    Vue.filter('unit', unitFilter);

    Vue.prototype.t = function (string, variables) {
        if (!vm.globalize) {
            return string;
        }
        try {
            return vm.globalize.formatMessage(string, variables);
        } catch (e) {
            warn(e);
            return string;
        }
    };

    // Also add filters to prototype, so that they can be used
    // outside of text bindings.
    Vue.prototype.format = {
        date: dateFilter,
        time: timeFilter,
        datetime: datetimeFilter,
        number: numberFilter,
        percent: percentFilter,
        currency: currencyFilter,
        plural: pluralFilter,
        relativeTime: relativeTimeFilter,
        unit: unitFilter
    };

    Vue.prototype.$setLocale = function (locale) {
        return vm.setLocale(locale);
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
                currentLoaderPromise = currentLoaderPromise.then(function (_ref3) {
                    var globalize = _ref3.globalize,
                        locale = _ref3.locale;

                    loadAdditionalCategories(globalize, locale, [category]).then(function (globalize) {
                        vm.globalize = globalize;
                        Vue.set(vm.categoriesLoaded, category, true);
                    }, function (err) {
                        warn(err);
                    });
                });
                return currentLoaderPromise;
            }
        }
        return Promise.resolve(true);
    };

    /**
     * Remove a category from the currently used categories.
     * This does not actually unload the data, it only means that
     * the category will not be automatically loaded on a locale switch.
     */
    Vue.prototype.$removeGlobalizeCategory = function (category) {
        var index = vm.categoriesInUse.indexOf(category);
        if (index !== -1) {
            vm.categoriesInUse.splice(index, 1);
        }
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
var src_install = function install(externalVue, options) {
    if (installed) {
        warn('already installed');
        return;
    }
    options = options || {};

    var fail = false;
    var fns = ['loadGlobalize'];
    for (var i = 0, l = fns.length; i < l; i++) {
        var fn = fns[i];
        if (typeof options[fn] !== 'function') {
            warn('missing "' + fn + '" function');
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

    src_Vue = externalVue;
    util_defaultExport.Vue = src_Vue;
    installed = true;
    augment(src_Vue);
};

/* harmony default export */ __webpack_exports__["default"] = (src_install);

/***/ })
/******/ ]);
});