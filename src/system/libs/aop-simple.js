//see:
//https://blog.bitsrc.io/aspect-oriented-programming-in-javascript-c4cb43f6bfcc


/** Helping function used to get all methods of an object */
const getMethods = (obj) => Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(item => typeof obj[item] === 'function')

/** Replace the original method with a custom function that will call our aspect when the advice dictates */
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName]
    target[methodName] = (...args) => {
        
        var returnedValue;
        if(["before", "around"].includes(advice)) {
            aspect.apply(target, args)
            returnedValue = originalCode.apply(target, args)
        }
        if(["measure"].includes(advice)) {
            performance.mark(methodName + " : start")
            returnedValue = originalCode.apply(target, args)
            performance.mark(methodName + " : end");
            var measure = performance.measure(methodName + " : start", methodName + " : end")
            aspect.call(target, measure);
        }
        
        if(["after", "around"].includes(advice)) {
            returnedValue = originalCode.apply(target, args)
            aspect.apply(target, args)
        }
        
        if("afterReturning" == advice) {
            return aspect.apply(target, [returnedValue])
        } else {
            return returnedValue
        }
    }
}


var meld = function(target, aspect, advice, pointcut="method", method = null) {
	if(pointcut == "method") {
		if(method != null) {
			replaceMethod(target, method, aspect, advice)    
		} else {
			throw new Error("Tryin to add an aspect to a method, but no method specified")
		}
	}
	if(pointcut == "methods") {
		const methods = getMethods(target)
		methods.forEach( m => {
			replaceMethod(target, m, aspect, advice)
		})
	}
}


var instrumentation = {
    measure : function(target, method, aspect) {
        meld(target, aspect || ((...args) => {
            console.log(performance.getEntriesByType("measure"))
            // debugger
            // performance.measure(method + " : start", method + " : end")
        }), "measure", "method", method)
    }
}
export {meld, instrumentation}