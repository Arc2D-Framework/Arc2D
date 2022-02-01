import '@system.drivers.storage.Memory';

namespace `domain.collections` (
    class Movies extends Collection {
        @public seeds  = REPOSITORY.FOODS;
        @public driver = system.drivers.storage.Memory;
    }
);


