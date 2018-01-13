import Vue from 'vue';
import VueGlobalize from '@/index.js';
import Globalize from 'globalize';
import Cldr from 'cldrjs';

delete require.cache[require.resolve('vue')];
delete require.cache[require.resolve('@/index.js')];
delete require.cache[require.resolve('globalize')];
delete require.cache[require.resolve('cldrjs')];

describe('Vue.filters', function() {
    Vue.use(VueGlobalize, {
        loadGlobalize: function(locale, categories, globalize, callback) {
            Globalize.load(
                require('cldr-data/supplemental/likelySubtags'),
                require('cldr-data/supplemental/plurals'),
                require('cldr-data/supplemental/ordinals'),
                require('cldr-data/supplemental/metaZones'),
                require('cldr-data/supplemental/timeData'),
                require('cldr-data/supplemental/weekData'),
                require('cldr-data/supplemental/numberingSystems'),
                require('cldr-data/supplemental/currencyData'),
                require('cldr-data/main/en/numbers'),
                require('cldr-data/main/en/currencies'),
                require('cldr-data/main/en/dateFields'),
                require('cldr-data/main/en/units'),
                require('cldr-data/main/en/ca-gregorian'),
                require('cldr-data/main/en/timeZoneNames')
            );
            Globalize.loadMessages({
                'en': {
                }
            });
            globalize = new Globalize(locale);
            callback(globalize);
        }
    });
    var vm = new Vue();

    beforeEach(function() {
        Cldr._raw = {};
        Cldr._resolved = {};
        vm.$setLocale(null);
    });

    it('should format date', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.date(new Date(2010, 8, 15, 17, 35, 7, 369)))
                .to.equal('Sep 15, 2010');
            expect(vm.format.date(new Date(2010, 8, 15, 17, 35, 7, 369), 'short'))
                .to.equal('9/15/10');
        });
    });
    it('should format time', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.time(new Date(2010, 8, 15, 17, 35, 7, 369)))
                .to.equal('5:35:07 PM');
            expect(vm.format.time(new Date(2010, 8, 15, 17, 35, 7, 369), 'short'))
                .to.equal('5:35 PM');
        });
    });
    it('should format datetime', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.datetime(new Date(2010, 8, 15, 17, 35, 7, 369)))
                .to.equal('Sep 15, 2010, 5:35:07 PM');
            expect(vm.format.datetime(new Date(2010, 8, 15, 17, 35, 7, 369), 'short'))
                .to.equal('9/15/10, 5:35 PM');
        });
    });
    it('should format dateraw', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.dateraw(new Date(2010, 8, 15, 17, 35, 7, 369), 'GyMMMd'))
                .to.equal('AD2010Sep15');
        });
    });
    it('should format dateskeleton', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.dateskeleton(new Date(2010, 8, 15, 17, 35, 7, 369), 'GyMMMd'))
                .to.equal('Sep 15, 2010 AD');
        });
    });
    it('should format number', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.number(12345.6666))
                .to.equal('12,345.667');
            expect(vm.format.number(12345.6666, {maximumFractionDigits: 2}))
                .to.equal('12,345.67');
        });
    });
    it('should format percent', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.percent(0.6355))
                .to.equal('64%');
            expect(vm.format.percent(0.6355, {minimumFractionDigits: 0, maximumFractionDigits: 2}))
                .to.equal('63.55%');
        });
    });
    it('should format currency', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.currency(12345.6666, 'USD'))
                .to.equal('$12,345.67');
            expect(vm.format.currency(12345.6666, 'CAD'))
                .to.equal('CA$12,345.67');
        });
    });
    it('should format plural', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.plural(1))
                .to.equal('one');
            expect(vm.format.plural(2))
                .to.equal('other');
            expect(vm.format.plural(1, 'ordinal'))
                .to.equal('one');
            expect(vm.format.plural(2, 'ordinal'))
                .to.equal('two');
            expect(vm.format.plural(3, 'ordinal'))
                .to.equal('few');
            expect(vm.format.plural(4, 'ordinal'))
                .to.equal('other');
        });
    });
    it('should format relativetime', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.relativeTime(-2, 'hour'))
                .to.equal('2 hours ago');
            expect(vm.format.relativeTime(1, 'day'))
                .to.equal('tomorrow');
            expect(vm.format.relativeTime(0, 'minute'))
                .to.equal('this minute');
        });
    });
    it('should format unit', function() {
        return vm.$setLocale('en').then(function() {
            expect(vm.format.unit(20, 'kilometer'))
                .to.equal('20 kilometers');
            expect(vm.format.unit(21, 'kilometer', {form: 'short'}))
                .to.equal('21 km');
            expect(vm.format.unit(22, 'kilometer', {form: 'narrow'}))
                .to.equal('22km');
        });
    });
});
