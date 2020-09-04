
namespace `core.drivers.storage`(
    class Cursor extends Array {
        constructor (items, query, IRequestStorage){
            /*items = (items&&items.all)?items.all():
                    (items instanceof Array)?items:[];*/
            super();
            
            if(IRequestStorage){
                // this.mongo_cursor = mongo_cursor;
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


        async sort(obj){
            this.paginator.data=this.mongo_cursor.all();
            this.paginator.resetindex();
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
                this.fill(this.paginator.next())
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

        // sort(attrb, order){
        //     super.sort(function(a, b) {
                
        //         var nameA = a[attrb].toUpperCase(); // ignore upper and lowercase
        //         var nameB = b[attrb].toUpperCase(); // ignore upper and lowercase
        //         if(order){
        //             if (nameA < nameB) {
        //                 return -1;
        //             }
        //             if (nameA > nameB) {
        //                 return 1;
        //             }
                
        //             // names must be equal
        //             return 0;
        //         } else {
        //             if (nameA < nameB) {
        //                 return 1;
        //             }
        //             if (nameA > nameB) {
        //                 return -1;
        //             }
                
        //             // names must be equal
        //             return 0;
        //         }
        //     });
        //     return this;
        // }
    }
);
 