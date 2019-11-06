import '/resources/routes.js';
import '/framework/src/core/data/Collection.js';



namespace `core.data` (
	class Movies extends core.data.Collection {
		// public device_driver = "core.drivers.storage.RestDB";
		// @public seeds = ROUTES.DATA.MOVIES;

	    constructor(driver="core.drivers.storage.Memory", ...items){
	        super(driver,...items);
	    }
	}
);
