/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2009 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 * http://www.broofa.com/2008/09/javascript-uuid-function/
 * 
 * 
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
; Math.uuid = (function() {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 
  
    return function (len, radix) {
      var chars = CHARS, uuid = [];
      radix = radix || chars.length;
  
      if (len) {
        // Compact form
        for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
      } else {
        // rfc4122, version 4 form
        var r;
  
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
  
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (var i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
  
      return uuid.join('');
    };
  })();
  
  // A more compact, but less performant, RFC4122v4 compliant solution:
  Math.uuid2 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
    }).toUpperCase();
  };
  
  
  
  
  Math.abbrNum = function(number, decPlaces) {
      // 2 decimal places => 100, 3 => 1000, etc
      decPlaces = Math.pow(10,decPlaces);
  
      // Enumerate number abbreviations
      var abbrev = [ "k", "m", "b", "t" ];
  
      // Go through the array backwards, so we do the largest first
      for (var i=abbrev.length-1; i>=0; i--) {
  
          // Convert array index to "1000", "1000000", etc
          var size = Math.pow(10,(i+1)*3);
  
          // If the number is bigger or equal do the abbreviation
          if(size <= number) {
               // Here, we multiply by decPlaces, round, and then divide by decPlaces.
               // This gives us nice rounding to a particular decimal place.
               number = Math.round(number*decPlaces/size)/decPlaces;
  
               // Handle special case where we round up to the next abbreviation
               if((number == 1000) && (i < abbrev.length - 1)) {
                   number = 1;
                   i++;
               }
  
               // Add the letter for the abbreviation
               number += abbrev[i];
  
               // We are done... stop
               break;
          }
      }
  
      return number;
  };
  