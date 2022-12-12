import '/src/system/drivers/storage/Memory.js';

namespace `domain.collections` (
    class Movies extends Collection {
        static seeds  = REPOSITORIES.MOVIES;
        static driver = system.drivers.storage.Memory;
    }
);


