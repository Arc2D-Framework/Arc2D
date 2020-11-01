
//NOTE: built into Arc Engine by default. Only for demonstration.
namespace `system.drivers.watchers` (
    class Watcher {
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
