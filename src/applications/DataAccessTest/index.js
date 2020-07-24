mingo = (await require('/node_modules/od-mingo/dist/mingo.es6.js')).default;

import! 'core.data.Movies';

namespace `applications` (
    class DataAccessTest extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
