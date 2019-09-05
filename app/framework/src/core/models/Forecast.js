import '/src/core/models/Collection.js';
import '/src/core/drivers/storage/MockStorageDevice.js';
import '/src/core/drivers/storage/WorldWeatherDevice.js';

namespace('core.models.Forecast', class extends core.models.Collection {
    @public device_driver = "core.drivers.storage.WorldWeatherDevice";
    @public seeds = ROUTES.DATA.FORECAST;

    constructor(...items) {
        super(...items);
    }

    isSeedable() {
        return false;
    }
});
