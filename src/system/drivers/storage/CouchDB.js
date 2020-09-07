import '/framework/src/core/drivers/storage/Cursor.js';

/**
 * @desc Driver for interfacing with CouchDB NoSQL database.
 */
namespace `core.drivers.storage` (
    class CouchDB extends core.drivers.storage.IStorageInterface{

        constructor (collection, storage_device){
            super(collection, storage_device);
            this.setCollection(collection.classname);
        }

        isSeedingEnabled(){
            return true;
        }

        setCollection(name) {
            this.collection_name = name.toLowerCase();
        }

        remove(cb,query) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status == 200) {
                        var obj = JSON.parse(this.responseText);
                        cb&&cb(obj);
                    } else {
                        console.error("unable to remove", this)
                    }
                }
            });
            xhr.open("DELETE", `http://127.0.0.1:5984/${this.collection_name}/${query._id}?rev=${query._rev}`,false);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(null);
        }

        add(obj, cb) {
            var data = JSON.stringify(obj);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var obj = JSON.parse(this.responseText);
                    cb(obj, null);
                }
            });
            xhr.open("POST", `http://127.0.0.1:5984/${this.collection_name}`);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(data);
        }

        find(cb, query) {
            query = query ? {selector:query} : {selector:{}};
            query = JSON.stringify(query);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState == 4) {
                    var res = this.responseText;
                    var c = new core.drivers.storage.Cursor({
                        all: function () {
                            return JSON.parse(res).docs;
                        }
                    });
                    cb(c, null)
                }
            });
            xhr.open("POST", `http://127.0.0.1:5984/${this.collection_name}/_find`);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(query);
        }
    }
);
