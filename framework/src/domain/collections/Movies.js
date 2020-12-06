
import! 'system.drivers.storage.Memory';
import! 'system.drivers.storage.LocalStorage';
import! 'system.drivers.storage.RestDB';


namespace `domain.collections` (
    class Movies extends Collection {
        @public device_driver = "system.drivers.storage.Memory";
        @public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

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


