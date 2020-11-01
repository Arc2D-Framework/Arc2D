/**
 * Object.prototype.watch polyfill
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
 *
 * Known limitations:
 * - `delete object[property]` will remove the watchpoint
 *
 * Based on Eli Grey gist https://gist.github.com/eligrey/384583
 * Impovements based on Xose Lluis gist https://gist.github.com/XoseLluis/4750176
 * This version is optimized for minification
 *
 * WTFPL.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */


//https://gist.github.com/adriengibrat/b0ee333dc1b058a22b66


//alternatively, if you want a behavior more akin watchers in vue/react/angular you can modify the setter function as follows:


// setter = function (val) {
//   oldval = newval;
//   return newval = (function() {
//     handler.call(this, prop, oldval, val);
//     return val;
//   })();
// };



(function (Object, descriptor) {
  var prototype = Object.prototype,
    defineProperty = Object.defineProperty,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    enumerable = 'enumerable';
  // object.watch
  if (!prototype.watch) {
    descriptor.value = function (property, handler) {
      var
        descriptor = getOwnPropertyDescriptor(this, property),
        _value = descriptor.value,
        getter = descriptor.get || function () {
          return _value;
        },
        setter = function (value) {
          _value = handler.call(this, property, _value, value);
          if (setter._set) {
            setter._set.call(this, _value);
          }
          return _value;
        }
      ;
      setter._set = descriptor.set; // backup old setter
      if (descriptor.configurable && // can't watch constants
        descriptor.writable !== false) { // don't watch readonly
        defineProperty(this, property, {
          get: getter,
          set: setter,
          enumerable: descriptor[enumerable],
          configurable: true
        });
      }
    };
    defineProperty(prototype, 'watch', descriptor);
    // object.unwatch
    descriptor.value = function (property) {
      var descriptor = getOwnPropertyDescriptor(this, property);
      if (descriptor.set && descriptor.set.hasOwnProperty('_set')) {
        defineProperty(this, property, descriptor.set._set ? {
          get: descriptor.get,
          set: descriptor.set._set,
          enumerable: descriptor[enumerable],
          configurable: true
        } : {
          value: this[property],
          enumerable: descriptor[enumerable],
          configurable: true,
          writable: true
        });
      }
    };
    defineProperty(prototype, 'unwatch', descriptor);
  }
})(Object, {enumerable: false, configurable: true, writable: false});