
import '@system.drivers.storage.Memory';
import '@system.drivers.storage.LocalStorage';
import '@system.drivers.storage.RestDB';
import '@system.drivers.storage.CouchDB';

namespace `domain.collections` (
    class Movies extends Collection {
        @public device_driver = "system.drivers.storage.LocalStorage";
        @public seeds = REPOSITORIES.MOVIES;

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }

        static async insert(obj,cb){
            var results = await super.add(obj,cb)
            application.dispatchEvent("domain.collections.Movies::changed", results);
            return results;
        }
    }
);


