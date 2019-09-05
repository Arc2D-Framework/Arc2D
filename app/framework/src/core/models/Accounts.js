import '/src/core/models/Collection.js';
import '/src/core/drivers/storage/MockStorageDevice.js';


namespace('core.models.Accounts', class extends core.models.Collection {
    @public device_driver = "core.drivers.storage.MockStorageDevice";
    @public seeds = ROUTES.DATA.ACCOUNTS;

    constructor(...items){
        super(...items);
    }
});