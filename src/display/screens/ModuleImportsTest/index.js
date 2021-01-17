var {TWEEN} = await require('/src/system/physics/tween.esm.js');
import {myExport,hello as Hello, samplex} from '/src/system/libs/sample_modules/a.mjs';
import {NodeTest as N} from '/src/system/libs/sample_modules/nodejsmod.js';
var {NodeTest} = await require('/src/system/libs/sample_modules/nodejsmod.js');
import '/node_modules/sweetalert/dist/sweetalert.min.js';
await require('/src/system/libs/sample_modules/introjs.js');
import 'display.components.ToggleButton';


namespace `display.screens` (
    class ModuleImportsTest extends Application {
        constructor(element){
            super(element);
            try{
                console.log("TWEEN",TWEEN)
                console.log("Hello",Hello)
                console.log("myExport",myExport)
                console.log("sample x",samplex)
                console.log("NodeTest",NodeTest)
                console.log("swal",swal);
                swal("Good job!", "All good", "success");
                } catch(e){console.error(e.message)}
        }

        async onConnected() {
            await super.onConnected();
            var t = this.querySelector("*[id='toggle-button']");
            new display.components.ToggleButton(t)
        }
    }
);
