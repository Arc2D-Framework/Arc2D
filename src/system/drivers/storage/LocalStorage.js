import '/src/system/drivers/storage/Cursor.js';
import '/resources/repositories.js';
await require('/src/system/drivers/storage/Query.js');
var {IStorageInterface} = system.drivers.storage;

namespace `system.drivers.storage`(
    class LocalStorage extends IStorageInterface {
        constructor (collection, storage_device){
            super(collection, storage_device);
            this.setCollection(collection.name);
        }

        isSeedingEnabled(){
            return true;
        }

        commit(){
            localStorage.setItem(this.collection_name, JSON.stringify(this.data));
        }

        isSeeded(){
            return this.data.seeded==true
        }

        setSeeded(){
            this.data.seeded=true;
        }

        setCollection (name){
            this.collection_name = name;
            this.data = JSON.parse(localStorage.getItem(this.collection_name))||{items:[]};
        }

        add(obj, cb){
            this.data.items.push(obj);
            this.commit();
            cb&&cb(obj,null);
            return obj;
        }

        update(obj, cb){
            this.data.items.forEach(item => {
                if(item._id==obj._id){
                    Object.assign(item,obj);
                    this.commit();
                    cb&&cb(obj,null);
                    return obj;
                }
            })
        }
 
        remove(cb,query){
            var res = Query.query( this.data.items, query.query||query||{});
            var removed=[];
            res.forEach(o => {
                for(var i=0; i<=this.data.items.length-1; i++){
                    if(this.data.items[i]._id == o._id){
                        this.data.items.splice(i,1);
                        removed.push(o);
                    }
                }
            });
            this.commit();
            cb && cb(removed,null);
            return removed;
        }

        find(cb, query){
            var res = Query.query( this.data.items, query.query||{});
            var cursor = new system.drivers.storage.Cursor(res,query,this);
            cursor.next();
            cb&&cb(cursor, null)
            return cursor;
        }

        commit(){
            localStorage.setItem(this.collection_name, JSON.stringify(this.data));
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