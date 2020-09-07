import '/src/core/drivers/storage/Cursor.js';
import '/node_modules/od-mingo/dist/mingo.min.js';

/**
 * @desc A device driver for WorldWeatherOnline.com 
 * api communication. Not to be used directly by developers.
 */
namespace('core.drivers.storage.WorldWeatherDevice', class {
    constructor() {

    }

    setCollection(name) {
        this.collection_name = name.toLowerCase();
    }

    add(obj, cb) {
        console.warn(`${this.namespace} - add() not supported`)
    }

    async find(cb,query) {
        var response;
        var res;
        if(!Config.DEBUG){
            if(query.keyword){
                response = await fetch(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a22ddbee017e4ca2af5125837190604&q=${query.keyword}&format=json&num_of_days=5&includelocation=yes`);
                res = await response.json();
            }  else {
                response = await fetch(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=a22ddbee017e4ca2af5125837190604&q=${query.latitude},${query.longitude}&format=json&num_of_days=5&includelocation=yes`);
                res = await response.json();
            }
            cb(res);
        } else {
            response = await fetch(Config.ROOTPATH + `resources/data/weather.json`);
            res = await response.json();
            cb(res);
        }
        
    }

    remove(query, cb) {
        console.warn(`${this.namespace} - remove() not supported`)
    }
});