
import '@system.drivers.storage.LocalStorage';

namespace `domain.collections` (
    class Todos extends Collection {
        @public device_driver = "system.drivers.storage.LocalStorage";
        // @public seeds = REPOSITORIES.TODOS;

        static isSeedable(){
            return false;
        }

        static async insert(obj,cb){
            var results = await super.add(obj,cb);
            application.dispatchEvent("domain.collections.Todos::insert", results);
            application.dispatchEvent("domain.collections.Todos::changed", results);
            return results;
        }

        static async update(obj,cb){
            var results = await super.update(obj,cb);
            application.dispatchEvent("domain.collections.Todos::changed", results);
            return results;
        }

        static async remove(query,cb){
            var results = await super.remove(query,cb);
            application.dispatchEvent("domain.collections.Todos::changed", results);
            return results;
        }

        static async clear(query,cb){
            var results = await super.remove(query,cb);
            application.dispatchEvent("domain.collections.Todos::changed", results);
            return results;
        }
    }
);


