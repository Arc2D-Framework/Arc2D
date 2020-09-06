import! 'core.drivers.storage.LocalStorage';

namespace `core.data` (
	class Movies extends Collection {
		@public device_driver = "core.drivers.storage.LocalStorage";
		@public seeds = REPOSITORIES.MOVIES; /*see: app/resources/repositories.js*/

		static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
	}
);


