import '/resources/routes.js';
import '/src/core/models/Collection.js';
import '/src/core/drivers/storage/MockStorageDevice.js';


namespace('core.models.Movies', class extends core.models.Collection {
    @public device_driver = "core.drivers.storage.MockStorageDevice";
    @public seeds = ROUTES.DATA.MOVIES;

    constructor(...items){
        super(...items);
    }
});
