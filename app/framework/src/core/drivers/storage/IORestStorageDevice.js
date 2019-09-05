import '/src/core/drivers/storage/HttpCursor.js';
import '/src/core/drivers/storage/Command.js';

/**
 * @desc Device for interfacing with (http://restdb.io) NoSQL database.
 */
namespace('core.drivers.storage.IORestStorageDevice', class {
    constructor() {

    }

    setCollection(name) {
        this.collection_name = name.toLowerCase();
    }

    remove(query, cb) {
        /*this.find(res => {
            if(res){
                res.forEach(item => {
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        if(this.status == 200){
                            cb(item);
                        } else{
                            console.error("unable to remove", this)
                        }
                    }
                    });
                    xhr.open("DELETE", "https://testing-a837.restdb.io/rest/"+this.collection_name + "/${item._id}", false);
                    xhr.setRequestHeader("content-type", "application/json");
                    xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
                    xhr.setRequestHeader("cache-control", "no-cache");
                    xhr.send(data);
                });
            }
        }, query)*/
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
        debugger;
        query = JSON.stringify(query || {});
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // alert(this.responseText)
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

        xhr.send(null);
    }

});
