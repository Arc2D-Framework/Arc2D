import! 'system.drivers.storage.Memory';

namespace `domain.collections` (
    class Employees extends Collection {
        @public device_driver = "system.drivers.storage.Memory";
        @public seeds = REPOSITORIES.EMPLOYEES; /*see: app/resources/repositories.js*/

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
    }
);


