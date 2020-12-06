var {TWEEN} = await import('/src/system/2d/tween.esm.js');
var {myExport,hello : Hello, runit} = await import('/src/system/libs/sample_modules/a.mjs');
import {NodeTest} from '/src/system/libs/sample_modules/nodejsmod.js';
import '/node_modules/sweetalert/dist/sweetalert.min.js';
await require('/src/system/libs/sample_modules/introjs.js');
import 'display.components.ToggleButton';


namespace `display.screens` (
    class ModuleImportsTest extends w3c.ui.Application {
        constructor(element){
            super(element);
            console.log("TWEEN",TWEEN)
            console.log("Hello",Hello)
            console.log("NodeTest",NodeTest)
            console.log("swal",swal);
            swal("Good job!", "You clicked the button!", "success");
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
