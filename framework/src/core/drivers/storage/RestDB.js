import '/src/core/drivers/storage/Command.js';
import! 'core.drivers.storage.HttpCursor';


namespace `core.drivers.storage` (
    class RestDB extends core.drivers.storage.IStorageInterface{

        constructor (collection, storage_device){
            super(collection, storage_device);
            this.setCollection(collection.prototype.classname);
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

        find(cb, query, cursor) {
            var self=this;
            return new Promise(async resolve => {
                if(cursor){
                    var xhr = new XMLHttpRequest();
                        xhr.addEventListener("readystatechange", _ => {
                            if (xhr.readyState === 4) {
                                var data = xhr.responseText;
                                    data = JSON.parse(data);
                                var res = (data instanceof Array) ? data : data.data
                                    cursor.splice(0, cursor.length);
                                    if(res&&res.length){
                                        for(var i=0; i<=res.length-1;i++){
                                            cursor[i] = res[i];
                                        }
                                    }
                                    resolve(cursor)
                                    cb&&cb(cursor, null)
                            }
                        });
                        xhr.open("GET", "https://testing-a837.restdb.io/rest/" + this.collection_name + "?"+this.getTransformedQuery(query));
                        xhr.setRequestHeader("content-type", "application/json");
                        xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
                        xhr.setRequestHeader("cache-control", "no-cache");
                        xhr.setRequestHeader("Authorization", localStorage.getItem("accessToken"));
                        xhr.send(null);
                }
                else {
                    var xhr = new XMLHttpRequest();
                        xhr.addEventListener("readystatechange", _ => {
                            if (xhr.readyState === 4) {
                                var data = xhr.responseText;
                                    data = JSON.parse(data);
                                var res = (data instanceof Array) ? data : data.data
                                var c = new core.drivers.storage.HttpCursor([],query,this);
                                    c.count = data.totals.count;
                                    resolve(c)
                                    cb&&cb(c, null)
                            }
                        });
                        xhr.open("GET", "https://testing-a837.restdb.io/rest/" + this.collection_name + "?"+this.getTransformedQuery(query)+"&totals=true&count=true");
                        xhr.setRequestHeader("content-type", "application/json");
                        xhr.setRequestHeader("x-apikey", "5bd6ef18cb62286429f4ef19");
                        xhr.setRequestHeader("cache-control", "no-cache");
                        xhr.setRequestHeader("Authorization", localStorage.getItem("accessToken"));
                        xhr.send(null);
                }
            })
        }

        getTransformedQuery(query){
            var newQuery={};
            for(var key in query){
                if(key == "query"){
                    newQuery["q"]=JSON.stringify(query["query"]);

                }
                else if(key == "limit"){
                    newQuery["max"]=query["limit"]
                }
                else {
                    newQuery[key]=query[key]
                }
            }
            return newQuery.toQueryString()
        }



    }
);
