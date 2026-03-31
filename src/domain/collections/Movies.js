import {Memory} from "@storage";

namespace `domain.collections` (
    class Movies extends Collection {
        static seeds  = REPOSITORIES.MOVIES;
        static driver = Memory;
    }
);


