
namespace `core.drivers.storage` (
    class HttpCursor extends Array{
        constructor (items, query, IRequestStorage){
                items = (items&&items.all)?items.all():
                        (items instanceof Array)?items:[];
                super(...items);

                if(IRequestStorage){
                    this.query=query;
                    this.IRequestStorage=IRequestStorage;
                    this.query.skip = -this.query.limit
                }
            }


        async next(cb){
            this.query.skip += this.query.limit;
            return new Promise((resolve,reject) =>{
                this.IRequestStorage.find((result, error)=>{
                    cb?cb(this, error) :
                    resolve(this, error);
                },this.query,this)
            })
        }

        async previous(cb){
            this.query.skip -= this.query.limit;
            this.query.skip = this.query.skip<=0?0:this.query.skip;
            return new Promise((resolve,reject) =>{
                this.IRequestStorage.find((result, error)=>{
                    cb?cb(result, error):resolve(result, error);
                },this.query)
            })
        }

        sort(attrb, order){
            super.sort(function(a, b) {
                
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
    }
);
 