import '/framework/src/core/drivers/storage/pocket.js';
import '/framework/src/core/drivers/storage/Cursor.js';
import '/node_modules/od-mingo/dist/mingo.min.js';

/**
 * @desc Device for working with localStorage using
 * a mongodb-like api interface.
 */
namespace `core.drivers.storage`(
    class LocalStorage {
        constructor (){
            this.constructor.prototype.pocket = this.constructor.prototype.pocket||new Pocket();
        }

        setCollection (name){
            this.collection = this.pocket.collection(name)
        }

        add(obj, cb){
            this.collection.insert(obj);
            cb(obj,null);
        }

        remove(query, cb){
            query = new mingo.Query(query);
            var res = query.remove(this.collection.documents);
            this.collection.documents = res;
            cb(res,null)
        }

        find(cb,query){
            query = new mingo.Query(query||{});
            let cursor = query.find(this.collection.documents);
            var c = new core.drivers.storage.Cursor(cursor)
            cb(c,null)
        }
    }
);
