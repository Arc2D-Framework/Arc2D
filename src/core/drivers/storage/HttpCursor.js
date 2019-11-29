import '/src/core/drivers/storage/Cursor.js';
/**
 * @desc Device for simulating a NoSQL database such as
 * mongo or local storage because of common api. This 
 * device is handy during testing.
 */
namespace('core.drivers.storage.HttpCursor', class extends Array{
    constructor (_array){
        var items = _array||[]
        super(...items);
        // this.cursor = cursor ;
        this.setPaginator();
        console.log("HttpCursor",items)
    }

    setPaginator(){
        this.paginator = new core.traits.Paginator({
            data:this, pageSize:4
        });
        this.next = this.paginator.next.bind(this.paginator);
        this.previous = this.paginator.previous.bind(this.paginator);
        this.current = this.paginator.current.bind(this.paginator);
        this.first = this.paginator.first.bind(this.paginator);
        this.pagenumber = this.paginator.pagenumber.bind(this.paginator);
        this.totalpages = this.paginator.totalpages.bind(this.paginator);
    }
    

    // next(){
    //     var skip = this.page_size * (this.page_num - 1)
    // }

    // sort (sortCriteria){
    //     alert("asd")
    //     console.log("items before sort", this.cursor.all());
    //     this.cursor.sort(sortCriteria)
    //     console.log("items after sort", this.cursor.all());
    // }

    all(){
        return this;
    }

    skip(num){
        this._skip = num;
        // var take = 2;
        // var end = skip+take;
        return this.slice(this._skip)
    }

    take(num){
        this._limit = this._skip+num;
        return this.slice(this._skip,this._limit)
    }

    sort(attrb, order){
        // console.log(this.sort())
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
});
 