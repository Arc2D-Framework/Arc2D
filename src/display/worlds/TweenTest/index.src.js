(async ()=>{ namespace `system.input` (
    class KeyBoard {

        /* Direction key state */
        static get directions() {
            return {
               up: "up",
               down: "down",
               left: "left",
               right: "right"
           }
        }
        static get keys() {
            return {
               38: this.directions.up,
               37: this.directions.left,
               39: this.directions.right,
               40: this.directions.down
           }
        }

        static initialize(){
            this.held_directions = [];

            document.addEventListener("keydown", (e) => {
               var dir = this.keys[e.which];
               if (dir && this.held_directions.indexOf(dir) === -1) {
                  this.held_directions.unshift(dir)
               }
            })

            document.addEventListener("keyup", (e) => {
               var dir = this.keys[e.which];
               var index = this.held_directions.indexOf(dir);
               if (index > -1) {
                  this.held_directions.splice(index, 1)
               }
            });
        }
    }
);

system.input.KeyBoard.initialize();
KeyBoard = system.input.KeyBoard;


Math.lerp = function(start, end, amt, extrapolate = false){
    if(!extrapolate){return (1-amt)*start+amt*end}
    amt=Math.clamp(amt,0,1);
    return (1-amt)*start+amt*end
}

Math.clamp= function(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}


/*Copyright (c) 2009 Robert Kieffer
  Dual licensed under the MIT and GPL licenses.
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
Math.uuid = (function() {
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  return function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
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
var {Easing} = await import('/src/system/math/Easing.js');


namespace `display.worlds` (
    class TweenTest extends World {
        async onConnected() {
            await super.onConnected();

            this.coords = {x: 0, y: 0};
            this.box = this.querySelector("#box")
            this.dest = {x: 300, y: 200};
            this.duration = 500;
             
        }

        onFixedUpdate = (time,delta) =>{
            if(this.box.ismoving){
                var elapsed = (Date.now() - this.starttime);
                var percent = elapsed / this.duration;
                this.coords.x = Math.lerp(0, this.dest.x, Easing.Bounce.Out(percent),true);
                this.coords.y = Math.lerp(0, this.dest.y, Easing.Bounce.Out(percent),true);
                if(percent > 1) {
                    this.box.ismoving = false;
                }
            }
        }

        onUpdate=()=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this.starttime = Date.now();
                    this.box.ismoving=true
                }
            }
        }

        onDraw = () => {
            var x = Math.round(this.coords.x);
            var y = Math.round(this.coords.y);
            this.box.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
        }
    }
);

 })()