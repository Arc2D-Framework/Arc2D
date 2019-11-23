import '/node_modules/od-paginator/paginator.js';
import '/framework/src/core/drivers/storage/StorageInterface.js';
import '/framework/src/core/drivers/storage/RestDB.js';
import '/framework/src/core/drivers/storage/LocalStorage.js';
import '/framework/src/core/drivers/storage/Memory.js';

namespace `core.data` (
    @traits([new Observer]);
    class Collection extends Array {
        @public subscribers   = {};
        @public observations  = [];

        constructor (driver,...items){
            super(...items);
            (async _ => await this.setStorage(driver) )();
        }

        async setStorage(driverNS){
            this.device_driver=driverNS;
            this.interface = new NSRegistry[driverNS](this)
            await this.seed(this.seeds);
            console.log(this.namespace + " using ", this.interface)
        }

        async remove(obj,cb){
            var results = await this.interface.remove(obj,cb);
            return results;
        }

        async add(obj,cb){
            var results = await this.interface.add(obj,cb);
            return results;
        }

        async find(cb,query){
            return new Promise((resolve,reject) =>{
                this.interface.find((result, error)=>{
                    cb && cb(result, error);
                    resolve(result, error)
                },query)
            })
        }

        async all(cb){
            var results = await this.interface.all(cb);
            return results;
        }

        // get storage(){
        //     return new core.drivers.storage.StorageInterface(this);
        // }

        skip(num){
            this._skip = num;
            // var take = 2;
            // var end = skip+take;
            return this
        }

        limit(num){
            this._limit = this._skip+num;
            return this.slice(this._skip,this._limit)
        }

        sortby(attrb, order){
            // console.log(this.sort())
            this.sort(function(a, b) {
                
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
            return this;
        }


        onStorageChanged(e){}


        setData (name,data){
            if(data && data.items){
                for(let obj of data.items){
                    this.add(obj, (res)=> {});
                    // this.constructor.prototype.push(obj)
                }
            }
        }

        isSeedable(){
            return this.seeds;
        }

        async seed (uri, params, force){
            if(!this.isSeedable()) {
                this.dispatchEvent("loaded", {controller: this}, this);
                return
            };
            force = (typeof force == "boolean") ? force:false;
            uri = uri || this.CONFIG;
            if(!this.constructor.prototype.loaded || force){
                this.constructor.prototype.loaded=true;
                /*var self=this;
                    params=params||{};
                    var oReq = new XMLHttpRequest();
                    oReq.overrideMimeType("text/plain");
                        oReq.addEventListener("load", function(){
                            if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
                                self.onDataReceived(JSON.parse(this.responseText))
                            }
                        });
                        oReq.open("GET", uri.dev, false);
                        oReq.send();*/


                //TODO:
                //fetch vs. xhr(above snippet)...why wasn't this just fetch in 1st place?
                await fetch(uri[Config.ENVIRONMENT]) 
                    .then(async res => this.onDataReceived(await res.json(), null))
                    .catch(e => console.log("Error in " +this.namespace +"#seed():\n", e))
                    .finally(_ => this.dispatchEvent("loaded", {controller: this}, this))
            } else {
                this.dispatchEvent("loaded", {controller: this}, this);
            }
        }

        onDataReceived (_data, xhr){
            var self=this;
            _data = this.onInitializeModelDataObjects(_data);
            this.setData(_data.table, _data);

            //TODO: 
            //why was below snippet finding for no reason? commented.
            /*this.find((res) => {
                this.dispatchEvent("loaded", {controller: this}, this);
            });*/
        }

        getPaginator (size,cpage){
            size =  typeof size ==  "number" ? size:10;
            cpage = typeof cpage == "number" ? cpage:0;

            return new core.traits.Paginator({
                data : this.getData().items,
                pageSize : size,
                currentPage:cpage
            });
        }

        onInitializeModelDataObjects (data){
            /*var tablename = data.table;
            var items = data.items||[];
            for(var i=0; i<=items.length-1; i++) {
                var item = items[i];
                var Model = this['@datatype'];
                var modelObject = new Model(item);
                data.items.splice(i,1, modelObject);
            }
            ;*/
            return data;
        }

        onDownloadFailure (r, responseText){
            console.error("onDownloadFailure(): ", responseText)
        }
    }
);
