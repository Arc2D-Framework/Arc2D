import '@system.drivers.storage.Memory';

namespace `domain.collections` (
    class Foods extends Collection {
        @public seeds  = REPOSITORIES.FOODS;
        @public driver = system.drivers.storage.Memory;
    }
);


