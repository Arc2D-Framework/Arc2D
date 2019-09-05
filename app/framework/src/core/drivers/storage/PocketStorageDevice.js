import '/src/core/drivers/storage/pocket.js';
import '/src/core/drivers/storage/Cursor.js';
import '/node_modules/od-mingo/dist/mingo.min.js';

/**
 * @desc Device for working with localStorage using
 * a mongodb-like api interface.
 */
namespace('core.drivers.storage.PocketStorageDevice', class {
    constructor (){
        this.constructor.prototype.pocket = this.constructor.prototype.pocket||new Pocket();
    }

    // pocket : new Pocket(),

    setCollection (name){
        this.collection = this.pocket.collection(name)
    }

    add(obj, cb){
        this.collection.insert(obj);
        cb(obj,null);
        // console.log("PocketStorageDevice#add", obj)
    }

    find(cb,query){
        // var res = this.collection.find(query||{});
        // this.dataset=res;
        // var c = new core.drivers.storage.Cursor(...res)
        // cb(c,null);

        query = new mingo.Query(query||{});
        // console.log(this.coll)
        let cursor = query.find(this.collection.documents);
        // var res = this.collection;//just hand back all
        var c = new core.drivers.storage.Cursor(cursor)
        // cb(c,null);
        cb(c,null)
    }
});
