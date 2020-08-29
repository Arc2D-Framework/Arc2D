import '/resources/repositories.js';

namespace `core.data` (
    class Employees extends core.data.Repository {
        @public device_driver = "core.drivers.storage.Memory";
        @public seeds = REPOSITORIES.EMPLOYEES; /*see: app/resources/repositories.js*/

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
    }
);


