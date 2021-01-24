import 'display.components.ToggleButton';
var {TWEEN} = await require('/src/system/physics/tween.esm.js');
import {WristWatch,myExport,hello as Hello, samplex} from '/src/system/libs/sample_modules/a.mjs';
import {NodeTest as N} from '/src/system/libs/sample_modules/nodejsmod.js';
var {NodeTest} = await require('/src/system/libs/sample_modules/nodejsmod.js');
import '/node_modules/sweetalert/dist/sweetalert.min.js';
await require('/src/system/libs/sample_modules/introjs.js');




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
                console.log("WristWatch",WristWatch)
                console.log("swal",swal);
                if(TWEEN&&Hello&&myExport&&samplex&&NodeTest&&WristWatch){
                    swal("Passed: ESM modules and components successfully imported", "All good", "success");
                }
                else {
                    swal("Problems importing a module(s). See console", "All good", "error"); 
                }
            } catch(e){
                swal("Problems importing a module(s). See console", "All good", "error"); 
                console.error(e.message)
            }
        }

        async onConnected() {
            await super.onConnected();
            var t = this.querySelector("*[id='toggle-button']");
            new display.components.ToggleButton(t)
        }
    }
);
