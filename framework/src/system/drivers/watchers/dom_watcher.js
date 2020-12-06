//TODO: Format into class{} and test.
//GIST: https://gist.github.com/ebidel/d48d590ff54a6e3370ee

// Watch accesses/sets on a DOM element property.
function watchPropsOn(el) {
  return new Proxy(el, {
    get(target, propKey, receiver) {
      //return Reflect.get(target, propKey, receiver);
            console.log('get', propKey);
      return el[propKey];
    },
    set(target, propKey, value, receiver) {
      console.log('set', propKey, value);
      target[propKey] = value;
    }
  });
}

let el = document.createElement('div');

let elProxy = watchPropsOn(el);
elProxy.textContent = 'hi there';
console.log(elProxy.textContent);





/*
namespace `core.drivers.watchers` (
    class DomWatcher {
        static watch(object,prop,cb,force){
            var data = {object, prop, old:object[prop], val:""};
            var _cb = () => {
                data.val=object[prop];
                cb(data);
            }
            object.addEventListener("input", _cb,false);
            object.addEventListener("change",_cb,false);
            force?cb(data):null;
            return {
                unwatch : function(){
                    object.removeEventListener("input", _cb, false);
                    object.removeEventListener("change",_cb, false);
                }
            }
        }
    }
);

*/
