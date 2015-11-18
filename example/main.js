import Vue from 'vue';
import VueGlobalize from '../dist/vue-globalize';

Vue.config.debug = true;

Vue.use(VueGlobalize, {
    defaultCategories: ['main'],
    loadGlobalize: function(locale, categories, globalize, callback) {
        let promises = [];
        let rcontext = require.context('globalize-config!./i18n', false, /.*\.json$/);
        for (let category of categories) {
            promises.push(new Promise(function(resolve, reject) {
                rcontext('./' + category + '.json')(locale, function(initFn) {
                    initFn(resolve);
                });
            }));
        }

        Promise.all(promises).then(function([globalize]) {
            // replace the existing instance, since all the data is stored
            // in the Globalize function's properties anyway.
            callback(globalize);
        });
    }
});

let app = new Vue({ /* eslint no-unused-vars:0 */
    el: '#app',
    data: {
        shown: false
    },
    computed: {
        now: function() {
            return Date.now();
        },
        language: {
            get: function() {
                return this.$getLocale();
            },
            set: function(newValue) {
                this.$setLocale(newValue);
            }
        },
        languages: function() {
            return [
                {
                    locale: 'en',
                    name: 'English (US)'
                },
                {
                    locale: 'en-GB',
                    name: 'English (UK)'
                },
                {
                    locale: 'en-AU',
                    name: 'English (Australia)'
                },
                {
                    locale: 'de',
                    name: 'Deutsch'
                },
                {
                    locale: 'hu',
                    name: 'Hungarian'
                },
                {
                    locale: 'sr',
                    name: 'Serbian'
                },
                {
                    locale: 'sr-Latn',
                    name: 'Serbian (Latin)'
                },
                {
                    locale: 'hr',
                    name: 'Croatian'
                },
                {
                    locale: 'ja',
                    name: 'Japanese'
                }
            ];
        }
    },
    methods: {
        show() {
            this.shown = !this.shown;
            if (this.shown) {
                this.$addGlobalizeCategory('additional');
            } else {
                this.$removeGlobalizeCategory('additional');
            }
        }
    }
});
