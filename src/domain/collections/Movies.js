import! 'system.drivers.storage.LocalStorage';

namespace `domain.collections` (
    class Movies extends Collection {
        @public device_driver = "system.drivers.storage.LocalStorage";
        @public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
    }
);


