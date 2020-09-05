import! 'core.drivers.storage.Memory';

namespace `core.data` (
    class Employees extends Collection {
        @public device_driver = "core.drivers.storage.Memory";
        @public seeds = REPOSITORIES.EMPLOYEES; /*see: app/resources/repositories.js*/

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
    }
);


