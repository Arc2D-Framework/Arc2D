import '/framework/src/core/drivers/storage/Cursor.js';
import '/node_modules/od-mingo/dist/mingo.min.js';

/**
 * @desc Device for simulating a NoSQL database such as
 * mongo or local storage because of common api. This 
 * device is handy during testing.
 */
namespace('core.drivers.storage.MockStorageDevice', class {
    constructor (){
        if(!('mingo' in window)) { 
            console.error(this.namespace + " requires npm mingo to be installed. The storage device will still work but mongo-style queries will be ignored.");
        }
        Session.State.db = Session.State.db||{};
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
        // console.log("MockStorageDevice#add", obj)
    }
    
    find(cb,query){
        query = new mingo.Query(query||{});
        let cursor = query.find(this.collection);
        // var res = this.collection;//just hand back all
        var c = new core.drivers.storage.Cursor(cursor)
        // cb(c,null);
        cb(c,null)
        console.log("MockStorageDevice#find cursor", cursor)
    }

    remove(query, cb){
        query = new mingo.Query(query||{});
        let cursor = query.find(this.collection);
        // var res = this.collection;//just hand back all
        var c = new core.drivers.storage.Cursor(cursor)
        // cb(c,null);
        cb(c,null)
        console.log("MockStorageDevice#find cursor", cursor)
    }
});
 