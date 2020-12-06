
@traits([new Observer]);
namespace `domain.collections` (
    class Repository {
        static get IRequestStorage(){
            var driver = this.prototype.device_driver;
            this.interface = this.interface||new NSRegistry[driver](this,driver);
            this.device_driver=driver; 
            return this.interface;
        }

        static async add(obj,cb){
            var results = await this.IRequestStorage.add(obj,cb);
            return results;
        }

        static async all(cb){
            var results = await this.IRequestStorage.all(cb);
            return results;
        }

        static async remove(query,cb){
            var args=arguments;
            if(args.length==1){
                query=args[0];
                cb=null;
            }
            else if(args.length==2){
                query=args[1];
                cb=args[0];
            }
            else if(args.length==0){
                query={};
                cb=null;
            }
            return new Promise((resolve,reject) =>{
                this.IRequestStorage.remove((result, error)=>{
                    cb?cb(result, error):resolve(result, error);
                },query)
            })
        }


        static async find(cb=null,query){
            var args=arguments;
            if(args.length==1){
                query=args[0];
                cb=null;
            }
            else if(args.length==2){
                query=args[1];
                cb=args[0];
            }
            else if(args.length==0){
                query={};
                cb=null;
            }
            return new Promise((resolve,reject) =>{
                this.IRequestStorage.find((result, error)=>{
                    cb?cb(result, error):resolve(result, error);
                },query)
            })
        }

        static isSeedable(){
            return this.prototype.seeds;
        }


        static onDataReceived (data, xhr){
            var self=this;
            data = this.transform(data);
            this.setData(data.table||data.name, data);
        }

        static transform (data, xhr){
            return data;
            /*var tablename = data.table;
            var items = data.items||[];
            for(var i=0; i<=items.length-1; i++) {
                var item = items[i];
                var Model = this['@datatype'];
                var modelObject = new Model(item);
                data.items.splice(i,1, modelObject);
            }
            ;*/
        }

        static setData (name,data){
            if(data && data.items){
                for(let obj of data.items){
                    this.add(obj, (res)=> {});
                }
            }
        }

        static onInitializeModelDataObjects (data){
            return this.transform(data);
        }

        static async seed (uri, params, force){
            return new Promise(async (resolve,reject) =>{
                if(!this.isSeedable()) {
                    this.prototype.dispatchEvent("loaded", {controller: this}, this);
                    resolve();
                    return;
                };
                force = (typeof force == "boolean") ? force:false;
                uri = uri || this.prototype.seeds;
                if(!this.loaded || force){
                    this.loaded=true;
                    var response = await fetch(uri[Config.ENVIRONMENT]);
                    var json = await response.json();
                    var res = this.onDataReceived(json);
                    this.IRequestStorage.seeded=true;
                    this.prototype.dispatchEvent("loaded", {controller: this}, this);
                    resolve(res)
                } else {
                    this.prototype.dispatchEvent("loaded", {controller: this}, this);
                    this.IRequestStorage.seeded=true;
                    resolve()
                }  
            })
        }
    }
);

Collection = window.Collection = domain.collections.Repository;