/**
 * @namespace core.drivers.storage.*
 * @class IStorageInterface
 * @desc 
   An interface between a Collection/Repository 
 * and a storage device (MongoDB, Pocket, Zango, 
 * localStorage, etc).
 * @summary 
   The IStorageInterface is implemented by
 * classes implement low-level protocol access to a storage
 * device. The device could be local memory, session state,
 * or external databases such as rest/sql/nosql db's.
    
    Repository classes represent a collection of models (ex:
    movies, users, accounts, orders etc). See: core.data.Repositoy.

    Movies is configured to use a LocalStorage IStorageInterface. This
    setting need not be hard-coded, it can be injected by the application
    or a config, ex:
    @public device_driver = Config.DEFAULT_STORAGE;
 */
namespace `core.drivers.storage` (
    class IStorageInterface {
        constructor (collection, storage_device){
            console.log(`storage device for ${collection.classname}`,[collection, collection.device_driver])
        }

        isSeedingEnabled(){
            return false;
        }
    }
);