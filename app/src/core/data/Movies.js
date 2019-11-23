import '/resources/routes.js';
import '/framework/src/core/data/Repository.js';



namespace `core.data` (
	class Movies extends core.data.Repository {
		@public device_driver = "core.drivers.storage.LocalStorage";
		@public seeds = ROUTES.DATA.MOVIES;
	}
);


