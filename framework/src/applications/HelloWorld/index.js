import 'docs.demos.ui.ToggleButton';
import 'core.ui.SampleD';
import '/src/core/data/Movies.js';
import '/src/core/ui/MovieMenu/index.js';


namespace `applications` (
    class HelloWorld extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
