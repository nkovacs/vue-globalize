# vue-globalize

Globalization plugin for Vue.js.

## Requirements

 - Vue.js 2.0
 - Globalize 1.1
 - Promise (add your own polyfill if needed)

## Usage

```js
var VueGlobalize = require('vue-globalize');

Vue.use(VueGlobalize, {
    loadGlobalize: function(locale, categories, globalize, callback) {
        // make sure Globalize and the appropriate cldr data and messages
        // for the requested categories are loaded before creating the instance
        callback(new Globalize(locale));
    }
});
```

You can use [globalize-config-loader](https://github.com/nkovacs/globalize-config-loader) with webpack to load a precompiled Globalize instance for the requested locale. Check out the example directory.

## Options

- loadGlobalize: `function(locale, categories, globalize, callback)` **required**

    Loads a globalize instance for the given locale and categories.
Messages and formatters can be split into categories, and loaded only when needed.
If globalize is not null, the additional categories should be loaded into
the existing instance, and callback should be called with the same instance.
Otherwise callback should be called with the new instance.

    *Note*: Globalize loads all data into the Globalize function's properties, so it doesn't matter which instance you return, the new data will be available to all instances.

- defaultCategories: `array`
    A list of categories to load by default when initializing globalize. If you don't use categories, you can ignore this and the `categories` parameter of `loadGlobalize`.

## API

The following methods are added to `Vue.prototype`, so they are available to all Vue instances.

- t: `function(string, variables)`

    Translates a string with the given variables. Wrapper for Globalize.formatMessage.

- format: `Object`

    An object that holds all the filters, for use outside of text interpolations.
    See [Filters](#filters) for the list of filters.

- $setLocale: `function(locale)`

    Sets the locale used by the app.

- $getLocale: `function()`

    Returns the locale used by the app.

- $getGlobalize: `function()`

    Returns the current globalize instance. May be null if globalize has not been loaded yet.

- $addGlobalizeCategory: `function(category)`

    Adds a category to the currently used categories.
    Switching the locale will automatically load the currently used categories for the new locale.

- $removeGlobalizeCategory: `function(category)`

    Removes a category from the currently used categories.
    This does not actually unload data, it only prevents the category from being automatically loaded
    when switching the locale.

- $globalizeCategoryLoaded: `function(category)`

    Returns true if the category is loaded for the current locale.
    This can be used to prevent a flash of untranslated content before the data has loaded.

## Filters

- date: `(value, [format])`

    Formats a date value.
    `format` defaults to `'medium'`.
    Wrapper for `Globalize.formatDate({date: format})`.
- time: `(value, [format])`

    Formats a time value.
    `format` defaults to `'medium'`.
    Wrapper for `Globalize.formatDate({time: format})`.
- datetime: `(value, [format])`

    Formats a datetime value.
    `format` defaults to `'medium'`.
    Wrapper for `Globalize.formatDate({time: format})`.

- number: `(value, options)`

    Formats a number.
    Wrapper for `Globalize.formatNumber({style: 'decimal'})`.
- percent: `(value, options)`

    Formats a number as a percentage.
    Wrapper for `Globalize.formatNumber({style: 'percent'})`.

- currency: `(value, currency, options)`

    Formats a number as a currency.
    Wrapper for `Globalize.formatCurrency(value, currency, options)`

- plural: `(value, type)`

    Returns a value's plural group.
    `type` defaults to `'cardinal'`
    Wrapper for `Globalize.plural(value, {type: type})`

- relativeTime: `(value, unit, options)`

    Formats a relative time.
    Wrapper for `Globalize.formatRelativeTime(value, unit, options)`

- unit: `(value, unit, options)`

    Formats a unit.
    Wrapper for `Globalize.formatUnit(value, unit, options)`
