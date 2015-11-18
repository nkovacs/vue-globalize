// export default for holding the Vue reference
const exports = {};
export default exports;

/**
 * Warn stuff.
 *
 * @param {String} msg
 */

export function warn(msg) {
    /* istanbul ignore next */
    if (window.console) {
        console.warn('[vue-globalize] ' + msg);
        /* istanbul ignore if */
        if (!exports.Vue || exports.Vue.config.debug) {
            console.warn(new Error('warning stack trace:').stack);
        }
    }
}
