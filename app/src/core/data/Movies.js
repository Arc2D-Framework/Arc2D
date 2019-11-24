import '/resources/repositories.js';
import '/framework/src/core/data/Repository.js';



namespace `core.data` (
	class Movies extends core.data.Repository {
		@public device_driver = "core.drivers.storage.CouchDB";
		@public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

		static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
	}
);


