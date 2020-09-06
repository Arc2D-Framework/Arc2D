import '/node_modules/od-paginator/paginator.js';

namespace `core.drivers.storage`(
    class Cursor extends Array {
        constructor (items, query, IRequestStorage){
            super();
            
            if(IRequestStorage){
                this.currentPage=0;
                this.query=query;
                this.IRequestStorage=IRequestStorage;
                this.query.skip = -this.query.limit;
                this.items = items;
                this.paginator = new core.traits.Paginator({
                    data : this.items, pageSize : this.query.limit
                });
                this.count = this.items.length;
            }
        }

        pagenumber(){
            return this.paginator.pagenumber();
        }

        totalpages(){
            return this.paginator.totalpages();
        }

        clear(){
            this.splice(0, this.length);
        }

        fill(res){
            if(res&&res.length){
                for(var i=0; i<=res.length-1;i++){
                    this[i] = res[i];
                }
            }
        }


        next(cb){
            return new Promise((resolve,reject) =>{
                this.clear();
                this.fill(this.paginator.next());
                resolve(this)
            })
        }


        previous(cb){
            return new Promise((resolve,reject) =>{
                this.clear();
                this.fill(this.paginator.previous())
                resolve(this)
            })
        }

        all(){
            return this;
        }

        sort(attrb, order){
            this.IRequestStorage.sort(this, attrb, order);
        }
    }
);
 