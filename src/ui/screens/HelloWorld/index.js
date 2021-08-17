import {Label} from '/src/ui/components/Label/index.js';

namespace `ui.screens` (
    class HelloWorld extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            console.log(new Label)
        }
    }
);
