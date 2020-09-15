import '/src/system/drivers/storage/Cursor.js';
import '/resources/repositories.js';
window.Query = (await require('/framework/src/libs/query.js')).default;

namespace `system.drivers.storage` (
    class Memory extends system.drivers.storage.IStorageInterface {
        constructor (collection, storage_device){
            super(collection, storage_device);
            Session.State.db = Session.State.db||{};
            this.setCollection(collection.name);
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
            cb&&cb(obj,null);
            return obj;
        }
        
        find(cb, query){
            var res = Query.query( this.collection, query.query||{});
            var cursor = new core.drivers.storage.Cursor(res,query,this);
            cb&&cb(cursor, null)
            return cursor;
        }

        remove(cb,query){
            var res = Query.query( this.collection, query.query||{});
            var removed=[];
            res.forEach(o => {
                for(var i=0; i<=this.collection.length-1; i++){
                    if(this.collection[i]._id == o._id){
                        this.collection.splice(i,1);
                        removed.push(o);
                    }
                }
            });
            cb && cb(removed,null);
            return removed;
        }


        sort(cursor, attrb, order){
            order = order==1?true:false;
            cursor.items.sort(function(a, b) {
                
                var nameA = a[attrb].toUpperCase(); // ignore upper and lowercase
                var nameB = b[attrb].toUpperCase(); // ignore upper and lowercase
                if(order){
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                
                    // names must be equal
                    return 0;
                } else {
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1;
                    }
                
                    // names must be equal
                    return 0;
                }
            });
            cursor.paginator.resetindex();
            return cursor;
        }
    }
);
 