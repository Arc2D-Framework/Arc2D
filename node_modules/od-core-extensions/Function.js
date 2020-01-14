// if (!Function.prototype.bind) {
//   Function.prototype.bind = function (oThis) {
//     if (typeof this !== "function") {
//       // closest thing possible to the ECMAScript 5 internal IsCallable function
//       throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
//     }

//     var aArgs = Array.prototype.slice.call(arguments, 1), 
//         fToBind = this, 
//         fNOP = function () {},
//         fBound = function () {
//             return fToBind.apply(
//                         (this instanceof fNOP && oThis) ? this : oThis,
//                         aArgs.concat(Array.prototype.slice.call(arguments))
//                    );
//         };

//     fNOP.prototype = this.prototype;
//     fBound.prototype = new fNOP();

//     fBound.isBound = true;
//     fBound.boundedFunction = fToBind;
//     return fBound;
//   };
// };

if (!Function.prototype.debounce) {
    Function.prototype.debounce = function(wait, immediate) {
        var func = this;
        // 'private' variable for instance
        // The returned function will be able to reference this due to closure.
        // Each call to the returned function will share this common timer.
        var timeout;           
    
        // Calling debounce returns a new anonymous function
        return function() {
            // reference the context and args for the setTimeout function
            var context = this, 
            args = arguments;
    
            // this is the basic debounce behaviour where you can call this 
            // function several times, but it will only execute once [after
            // a defined delay]. 
            // Clear the timeout (does nothing if timeout var is undefined)
            // so that previous calls within the timer are aborted.
            clearTimeout(timeout);   
    
            // Set the new timeout
            timeout = setTimeout(function() {
    
                 // Inside the timeout function, clear the timeout variable
                 timeout = null;
    
                 // Check if the function already ran with the immediate flag
                 if (!immediate) {
                   // Call the original function with apply
                   // apply lets you define the 'this' object as well as the arguments 
                   //    (both captured before setTimeout)
                   func.apply(context, args);
                 }
            }, wait);
    
            // If immediate flag is passed (and not already in a timeout)
            //  then call the function without delay
            if (immediate && !timeout) 
                func.apply(context, args);  
         }; 
    }
};


// if(!Function.prototype.delay){
//   Function.prototype.delay = function(millisec, scope) {
//     scope = scope||this;
//     // Remove the seconds from the parameters to pass the this function.
//     var args = [].slice.call(arguments, 2);
//     // Call this function with the specified parameters in the specified amount
//     // of seconds.
//     var fnThis = this;
//     return setTimeout(function() {
//       fnThis.apply(scope, args);
//     }, millisec);
//   };
// };


// if(!Function.prototype.with){
//   Function.prototype.with = function(mixin) {
//     var c = class extends this{};
//     Object.assign(c.prototype,mixin);
//     return c;
//   };
// };

var wait = ms => new Promise((r, j)=>setTimeout(r, ms))
// wait(2000).then( ()=>console.warn('done'))
