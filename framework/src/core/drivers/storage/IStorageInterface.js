
namespace `core.drivers.storage` (
    class IStorageInterface {
        constructor (collection, storage_device){
            console.log(`storage device for ${collection.prototype.classname}`,storage_device)
        }

        isSeedingEnabled(){
            return false;
        }
    }
);