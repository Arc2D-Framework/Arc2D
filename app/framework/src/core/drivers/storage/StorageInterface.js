/**
 * @namespace core.drivers.storage.*
 * @class StorageInterface
 * @desc An adapter between a Collection 
 * and a storage device (MongoDB, Pocket, Zango, 
 * localStorage, etc).
 * @summary The StorageInterface enhances a Collection 
 * with CRUD methods exposed by a storage device. 
 * In essence, the Collection becomes a virtual storage
 * device on it's own. Use it, query it, add, remove and
 * update it -- it settles the storage part for you.
 * 
 * At developers surface, working with a Collection will
 * be the same regardless if the objects were being
 * stored on disk or a mongodb backend.
 * 
 * When developers create a new Collection, specify the 
 * storage device (optional) or let the StorageInterface 
 * determine the device by configuration.
 * 
 * Specialized drivers could be written to choose between
 * local and server/db storage based on internet connectivity
 * and handle synchronization when the app comes on line
 * again.
 */
namespace `core.drivers.storage` (
    class StorageInterface {
        constructor (collection, storage_device){
            storage_device = storage_device||collection.device_driver
            console.log("storage device",[collection,storage_device])
            if(NSRegistry[storage_device]){
                this.device = new NSRegistry[storage_device];
                this.device.setCollection(collection.classname);
            } else {
                console.error(this.namespace+" - storage device: " + storage_device + " is not defined")
            }

            this.collection = collection;
            // collection.add = this.add.bind(this);
            // collection.find = this.find.bind(this);
            // collection.remove = this.remove.bind(this);
            // collection.push = this.push.bind(this);
            // collection.all = this.all.bind(this);
            // collection.sort = collection.sort||this.sort.bind(this);
        }

        // sort: function(attrb, order, cb){
        //     var self=this;
        //     this.device.sort(attrb, order, cb);
        // },


        // push: function(obj,cb){
        //     var self=this;
        //     this.device.add(obj, (result, error)=>{
        //         self.collection.dispatchEvent("changed", result, self);
        //         cb(result, error);
        //     })
        // },


        add(obj,cb){
            var self=this;
            this.device.add(obj, (result, error)=>{
                self.collection.dispatchEvent("changed", result, self);
                cb(result, error);
            })
        }

        async remove(obj,cb){
            var self=this;
            return new Promise((resolve,reject) =>{
                self.device.remove(obj, (result, error)=>{
                    // result = new self.collection.constructor(...result);
                    // self.collection.splice(0);
                    // self.collection.push(...result);
                    // self.collection.dispatchEvent("find", result, self);
                    cb && cb(result, error);
                    resolve(result, error)
                })
            })
        }

        async find(cb,query){
            var self=this;
            return new Promise((resolve,reject) =>{
                self.device.find((result, error)=>{
                    // result = new self.collection.constructor(...result);
                    // self.collection.splice(0);
                    // self.collection.push(...result);
                    // self.collection.dispatchEvent("find", result, self);
                    cb && cb(result, error);
                    resolve(result, error)
                },query)
            })
        }

        async all(cb){
            var self=this;
            return new Promise((resolve,reject) =>{
                self.device.find((result, error)=>{
                    self.collection.dispatchEvent("all", result, self);
                    cb && cb(result, error);
                    resolve(result, error)
                })
            })
        }

    }
);