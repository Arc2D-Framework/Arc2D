import '/resources/repositories.js';
import! 'core.drivers.storage.RestDB';

namespace `core.data` (
	class Movies extends core.data.Repository {
		@public device_driver = "core.drivers.storage.RestDB";
		@public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

		static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
	}
);


