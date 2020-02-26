
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