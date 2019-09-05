import '/node_modules/od-paginator/paginator.js';
import '/framework/src/core/drivers/storage/StorageInterface.js';

@traits([new Observer]);
namespace('core.models.Collection', class extends Array {
    @public subscribers   = {};
    @public observations  = [];
    @public device_driver = "core.drivers.storage.MockStorageDevice";

    constructor (...items){
        super(...items);
        this.addEventListener("changed", (e)=> this.onStorageChanged(e), false);
        try{
            (async () => await this.setStorageDevice())()
        } catch(e){
            console.log("Error in " +this.namespace +"#setStorageDevice() - " + e.message,e)
        }
    }

    async setStorageDevice(){
        // this.interface = new core.drivers.storage.StorageInterface(this);
        // this.interface = new core.drivers.storage.StorageInterface(this, "core.drivers.storage.PocketStorageDevice");
        // this.interface = new core.drivers.storage.StorageInterface(this, "core.drivers.storage.MockStorageDevice");
        // this.interface = new core.drivers.storage.StorageInterface(this, "core.drivers.storage.IORestStorageDevice");
        
        this.interface = this.storage;
        await this.seed(this.seeds);
    }

    get storage(){
        return new core.drivers.storage.StorageInterface(this);
    }

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


    onStorageChanged(e){
        // alert("storage changed");
        // console.log("storage changed",e)
    }

    setData (name,data){
        if(data && data.items){
            for(let obj of data.items){
                this.add(obj, (res)=> {});
                // this.constructor.prototype.push(obj)
            }
        }
        // this.table = name;
        // application.db[name] = data;
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
            var self=this;
                params=params||{};
                var oReq = new XMLHttpRequest();
                oReq.overrideMimeType("text/plain");
                    oReq.addEventListener("load", function(){
                        if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
                            self.onDataReceived(JSON.parse(this.responseText))
                        }
                    });
                    oReq.open("GET", uri.dev, false);
                    oReq.send();
                // await fetch(uri.dev)
                //     .then(async response => this.onDataReceived(await response.json(), null))
                //     .catch(error => console.log("Error in " +this.namespace +"#seed():\n",error))
        } else {
            this.dispatchEvent("loaded", {controller: this}, this);
        }
    }

    // onDownloaded (r, responseText){
    //     try{
    //         try{
    //             var _data = JSON.parse(responseText);
    //         }
    //         catch(e) {
    //             console.error(e.message, e);
    //         }
    //         if(_data){
    //             this.onDataReceived(_data, r);
    //         }
    //     }
    //     catch(e){
    //         console.error(e.message,responseText)
    //     }
    // }

    onDataReceived (_data, xhr){
        var self=this;
        _data = this.onInitializeModelDataObjects(_data);
        this.setData(_data.table, _data);
        this.find((res) => {
            // this.paginator = new core.traits.Paginator({
            //     data : res,
            //     pageSize : 3,
            //     currentPage:0
            // });
            this.dispatchEvent("loaded", {controller: this}, this);
        });
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
        //alert("error downloading " + this.namespace + " data");
        console.error("onDownloadFailure(): ", responseText)
    }

});
