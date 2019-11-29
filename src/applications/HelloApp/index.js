import '/src/core/ui/FlyoutButton/index.js';
import '/node_modules/od-import-polyfill/import.js';
import '/src/core/ui/Test/index.js';
import {myExport} from "/src/modules/test.mjs";


namespace `applications` (
    class HelloApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        onEnableShadow(){
            return false
        }

        onConnected() {
            this.render();
        }
    }
);
