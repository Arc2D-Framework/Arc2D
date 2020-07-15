import '/resources/repositories.js';
import '/src/core/data/Repository.js';
import '/src/core/drivers/storage/Memory.js';


namespace `core.data` (
	class Movies extends core.data.Repository {
		@public device_driver = "core.drivers.storage.Memory";
		@public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

		static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
	}
);


