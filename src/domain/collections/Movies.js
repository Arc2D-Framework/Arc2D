import '@system.drivers.storage.Memory';

namespace `domain.collections` (
    class Movies extends Collection {
        @public seeds  = REPOSITORIES.MOVIES;
        @public driver = system.drivers.storage.Memory;
    }
);


