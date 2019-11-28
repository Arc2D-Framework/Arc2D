import '/framework/src/core/drivers/storage/Cursor.js';
import '/node_modules/od-mingo/dist/mingo.min.js';

/**
 * @desc Device for simulating a NoSQL database using
   local memory. Good for development/testing, not for
   use in prod env.
 */
namespace `core.drivers.storage` (
    class Memory extends core.drivers.storage.IStorageInterface {
        constructor (collection, storage_device){
            super(collection, storage_device);
            if(!('mingo' in window)) { 
                console.error(this.namespace + " requires npm mingo to be installed. The storage device will still work but mongo-style queries will be ignored.");
            }
            Session.State.db = Session.State.db||{};
            this.setCollection(collection.classname);
        }

        isSeedingEnabled(){
            return true;
        }

        setCollection (name){
            if(typeof Session.State.db[name] != "object"){
                Session.State.db[name] = [];
            }
            this.collection = Session.State.db[name];
        }

        add(obj, cb){
            this.collection.push(obj);
            cb(obj,null);
            // console.log("Memory#add", obj)
        }
        
        find(cb,query){
            query = new mingo.Query(query||{});
            let cursor = query.find(this.collection);
            // var res = this.collection;//just hand back all
            var c = new core.drivers.storage.Cursor(cursor)
            // cb(c,null);
            cb(c,null)
            // console.log("Memory#find cursor", cursor)
        }

        remove(query, cb){
            query = new mingo.Query(query||{});
            let cursor = query.find(this.collection);
            // var res = this.collection;//just hand back all
            var c = new core.drivers.storage.Cursor(cursor);
            var res = c.all()||[];
            var removed=[];
            res.forEach(o => {
                // console.log("should remove", o)
                for(var i=0; i<=this.collection.length-1; i++){
                    if(this.collection[i]._id == o._id){
                        this.collection.splice(i,1);
                        removed.push(o);
                    }
                }
            });
            cb(removed,null)
        }
    }
);
 