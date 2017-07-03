import Vue from 'vue';
import VueGlobalize from '@/index.js';
import Globalize from 'globalize';
import Cldr from 'cldrjs';

delete require.cache[require.resolve('vue')];
delete require.cache[require.resolve('@/index.js')];
delete require.cache[require.resolve('globalize')];
delete require.cache[require.resolve('cldrjs')];

describe('Vue.t', function() {
    var nooploader = function(locale, categories) {
        var msg = {};
        msg[locale] = {};
        Globalize.loadMessages(msg);
    };
    var messageLoader = nooploader;

    Vue.use(VueGlobalize, {
        loadGlobalize: function(locale, categories, globalize, callback) {
            Globalize.load(
                require('cldr-data/supplemental/likelySubtags'),
                require('cldr-data/supplemental/plurals'),
                require('cldr-data/supplemental/ordinals')
            );
            messageLoader(locale, categories);
            globalize = new Globalize(locale);
            callback(globalize);
        }
    });
    var vm = new Vue();

    beforeEach(function() {
        messageLoader = nooploader;
        Cldr._raw = {};
        Cldr._resolved = {};
        vm.$setLocale(null);
    });

    it('should translate message', function() {
        messageLoader = function(locale, categories) {
            Globalize.loadMessages({
                'en': {
                    'hello': 'Hello World!'
                }
            });
        };
        return vm.$setLocale('en').then(function() {
            expect(vm.t('hello')).to.equal('Hello World!');
        });
    });
    it('should not translate missing message', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.t('hello')).to.equal('hello');
        });
    });
    it('should support loading additional categories', function() {
        messageLoader = function(locale, categories) {
            var msg = {};
            msg[locale] = {
                main: locale + ' main'
            };
            Globalize.loadMessages(msg);
            categories.forEach(function(category) {
                var msg = {};
                msg[locale] = {};
                msg[locale][category] = locale + ' ' + category;
                Globalize.loadMessages(msg);
            });
        };

        return vm.$setLocale('en').then(function() {
            expect(vm.t('main')).to.equal('en main');
            return vm.$addGlobalizeCategory('extra');
        }).then(function() {
            expect(vm.$globalizeCategoryLoaded('extra')).to.be.true;
            expect(vm.t('extra')).to.equal('en extra');
            return vm.$setLocale('de');
        }).then(function() {
            expect(vm.t('main')).to.equal('de main');
            expect(vm.t('extra')).to.equal('de extra');
            vm.$removeGlobalizeCategory('extra');
            return vm.$setLocale('fr');
        }).then(function() {
            expect(vm.t('main')).to.equal('fr main');
            expect(vm.t('extra')).to.equal('extra');
        });
    });
});
