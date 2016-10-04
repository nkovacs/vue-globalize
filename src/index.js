import util, {warn} from './util';
// import Globalize from 'globalize';

let Vue;
let installed = false;
let globalizeLoader;
let defaultCategories = [];

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
    return new Promise(function(resolve, reject) {
        try {
            globalizeLoader(locale, categories, null, resolve);
        } catch (err) {
            reject(err);
        }
    });
}

function loadAdditionalCategories(globalize, locale, categories) {
    return new Promise(function(resolve, reject) {
        try {
            globalizeLoader(locale, categories, globalize, resolve);
        } catch (err) {
            reject(err);
        }
    });
}

let noop = function(value) {
    return value;
};

function augment(Vue) {
    let currentLoaderPromise = null;
    let vm = new Vue({
        data: {
            globalizeWrapper: wrapGlobalize(null),
            locale: null,
            categoriesInUse: defaultCategories,
            categoriesLoaded: {}
        },
        computed: {
            globalize: {
                get: function() {
                    return this.globalizeWrapper.globalize;
                },
                set: function(newValue) {
                    this.globalizeWrapper = wrapGlobalize(newValue);
                }
            }
        },
        methods: {
            dateFormatter: function(type, format) {
                if (!this.globalize) {
                    return noop;
                }
                let cache = this.globalizeWrapper.dateFormatterCache;
                if (!cache[type] || !cache[type][format]) {
                    let options = {};
                    options[type] = format;
                    let formatter = this.globalize.dateFormatter(options);
                    cache[type][format] = formatter;
                    return formatter;
                }
                return cache[type][format];
            },
            numberFormatter(options) {
                if (!this.globalize) {
                    return noop;
                }
                return this.globalize.numberFormatter(options);
            },
            currencyFormatter(currency, options) {
                if (!this.globalize) {
                    return noop;
                }
                return this.globalize.currencyFormatter(currency, options);
            },
            pluralGenerator(options) {
                if (!this.globalize) {
                    return noop;
                }
                return this.globalize.pluralGenerator(options);
            },
            relativeTimeFormatter(unit, options) {
                if (!this.globalize) {
                    return noop;
                }
                return this.globalize.relativeTimeFormatter(unit, options);
            },
            unitFormatter(unit, options) {
                if (!this.globalize) {
                    return noop;
                }
                return this.globalize.unitFormatter(unit, options);
            }
        },
        watch: {
            locale: function(locale, oldLocale) {
                if (locale !== null) {
                    currentLoaderPromise = new Promise((resolve, reject) => {
                        Promise.all([
                            createGlobalize(locale, this.categoriesInUse)
                        ]).then(([globalize]) => {
                            Vue.set(this, 'globalize', globalize);

                            let newCategoriesLoaded = {};
                            for (let i = 0, l = this.categoriesInUse.length; i < l; i++) {
                                let category = this.categoriesInUse[i];
                                newCategoriesLoaded[category] = true;
                            }
                            vm.categoriesLoaded = newCategoriesLoaded;

                            resolve({
                                globalize: globalize,
                                locale: locale
                            });
                        }, function(err) {
                            warn(err);
                            reject(err);
                        });
                    });
                }
            }
        }
    });

    Vue.filter('date', function(value, format) {
        try {
            return vm.dateFormatter('date', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('time', function(value, format) {
        try {
            return vm.dateFormatter('time', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('datetime', function(value, format) {
        try {
            return vm.dateFormatter('datetime', format || 'medium')(new Date(value));
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('number', function(value, options) {
        try {
            return vm.numberFormatter(options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('percent', function(value, options) {
        try {
            options = options || {};
            options.style = options.style || 'percent';
            return vm.numberFormatter(options)(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('currency', function(value, currency, options) {
        try {
            return vm.currencyFormatter(currency, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('plural', function(value, type) {
        try {
            return vm.pluralGenerator({type: type || 'cardinal'})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('relativeTime', function(value, unit, options) {
        try {
            return vm.relativeTimeFormatter(unit, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.filter('unit', function(value, unit, options) {
        try {
            return vm.unitFormatter(unit, options || {})(value);
        } catch (e) {
            warn(e);
            return value;
        }
    });

    Vue.prototype.t = function(string, variables) {
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

    Vue.prototype.$setLocale = function(locale) {
        vm.locale = locale;
    };

    Vue.prototype.$getLocale = function() {
        return vm.locale;
    };

    Vue.prototype.$getGlobalize = function() {
        return vm.globalize;
    };

    Vue.prototype.$globalizeCategoryLoaded = function(category) {
        return vm.categoriesLoaded[category] === true;
    };

    /**
     * Add a category to the currently used categories. Switching locale
     * will automatically load the currently used categories for the new locale.
     */
    Vue.prototype.$addGlobalizeCategory = function(category) {
        let index = vm.categoriesInUse.indexOf(category);
        if (index === -1) {
            vm.categoriesInUse.push(category);
            if (currentLoaderPromise) {
                currentLoaderPromise.then(({globalize, locale}) => {
                    loadAdditionalCategories(globalize, locale, [category]).then((globalize) => {
                        Vue.set(vm, 'globalize', globalize);
                        Vue.set(vm, 'categoriesLoaded.' + category, true);
                    }, function(err) {
                        warn(err);
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
    Vue.prototype.$removeGlobalizeCategory = function(category) {
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
let install = function(externalVue, options) {
    if (installed) {
        warn('already installed');
        return;
    }
    options = options || {};

    let fail = false;
    let fns = ['loadGlobalize'];
    for (let i = 0, l = fns.length; i < l; i++) {
        let fn = fns[i];
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

    Vue = externalVue;
    util.Vue = Vue;
    installed = true;
    augment(Vue);
};

export default install;
