//mport '/src/core/drivers/storage/HttpCursor.js';
import '/framework/src/core/drivers/storage/Command.js';
import '/framework/src/core/drivers/storage/Cursor.js';

/**
 * @desc Device for interfacing with (http://restdb.io) NoSQL database.
 */
namespace `core.drivers.storage` (
    class RestDB extends core.drivers.storage.IStorageInterface{

        constructor (collection, storage_device){
            super(collection, storage_device);
            this.setCollection(collection.classname);
        }

        isSeedingEnabled(){
            return false;
        }

        setCollection(name) {
            this.collection_name = name.toLowerCase();
        }

        remove(query, cb) {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status == 200) {
                        cb(query);
                    } else {
                        console.error("unable to remove", this)
                    }
                }
            });
            xhr.open("DELETE", "https://testing-a837.restdb.io/rest/" + this.collection_name + "/" + query._id, false);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send(null);
        }

        add(obj, cb) {
            var data = JSON.stringify(obj);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var obj = JSON.parse(this.responseText);
                    // cb(JSON.parse(this.responseText),null);
                    var cmd = new core.drivers.storage.Command;
                    cmd.undo = self.remove;
                    cmd.data = obj;
                    cb(obj, cmd);
                }
            });
            xhr.open("POST", "https://testing-a837.restdb.io/rest/" + this.collection_name);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
            xhr.setRequestHeader("cache-control", "no-cache");

            xhr.send(data);
        }

        find(cb, query) {
            query = JSON.stringify(query || {});
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var res = this.responseText;
                    var c = new core.drivers.storage.Cursor({
                        all: function () {
                            return JSON.parse(res);
                        }
                    });
                    cb(c, null)
                }
            });
            xhr.open("GET", "https://testing-a837.restdb.io/rest/" + this.collection_name + "?q=" + query);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.setRequestHeader("Authorization", localStorage.getItem("accessToken"));

            xhr.send(null);
        }
    }
);
