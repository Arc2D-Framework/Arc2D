Collections are repositories of individual kinds
of objects like:
    - Recipes
    - Users
    - Movies
    - Songs
    - Accounts



Example:
----------------------------------------------------------------------

import! 'system.drivers.storage.LocalStorage';

namespace `domain.collections` (
    class Movies extends Collection {
        @public device_driver = "system.drivers.storage.LocalStorage";
        @public seeds = REPOSITORIES.MOVIES;

        static isSeedable(){
            return this.IRequestStorage.isSeedingEnabled();
        }
    }
);









Seeding is only for testing, a realistic example, without seeding:
----------------------------------------------------------------------

import! 'system.drivers.storage.LocalStorage';

namespace `domain.collections` (
    class Movies extends Collection {
        @public device_driver = "system.drivers.storage.LocalStorage";
    }
);






