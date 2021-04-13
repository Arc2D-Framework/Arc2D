import '/src/system/drivers/storage/Cursor.js';


namespace `system.drivers.storage` (
    class CouchDB extends system.drivers.storage.IStorageInterface{

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

        find(cb, query, cursor) {
            return new Promise(async resolve => {
                debugger;
                // query = query ? {selector:query.query} : {selector:{}};
                // query = JSON.stringify(query);
                var couchQ = this.getTransformedQuery(query);
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", e => {
                    if (xhr.readyState == 4) {
                        var res = xhr.responseText;
                        var data = JSON.parse(res);
                        debugger;
                        var res = (data instanceof Array) ? data : data.docs;
                        var c = cursor||new system.drivers.storage.HttpCursor(res||[],couchQ,this);
                                    c.total = res.length;
                                    c.clear();
                                    c.fill(res);
                                    resolve(c)
                                    cb&&cb(c, null)
                    }
                });
                xhr.open("POST", `http://127.0.0.1:5984/${this.collection_name}/_all_docs`);
                xhr.setRequestHeader("content-type", "application/json");
                console.log("couch query",JSON.stringify(couchQ))
                xhr.send(JSON.stringify(couchQ));
            })
        }

        getTransformedQuery(query){
            var newQuery={};
            for(var key in query){
                if(key == "query"){
                    newQuery.selector = query.query||{};

                }
                if(key == "totals"){
                    newQuery.execution_stats = query.totals

                }
                else {
                    newQuery[key]=query[key]
                }
            }
            delete newQuery.totals;
            delete newQuery.query;
            return newQuery;
        }
    }
);
