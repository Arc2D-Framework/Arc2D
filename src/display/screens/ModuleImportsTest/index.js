import 'display.components.ToggleButton';
var {TWEEN} = await require('/src/system/physics/tween.esm.js');
import {* as ModuleA } from 'module-a';
import '/src/system/drivers/storage/Query.js';
import {* as N} from '/src/system/libs/sample_modules/nodejsmod.js';
var {NodeTest} = await require('/src/system/libs/sample_modules/nodejsmod.js');
import '/node_modules/sweetalert/dist/sweetalert.min.js';
await require('/src/system/libs/sample_modules/introjs.js');
import {* as THREE} from '3d';
import GLTFLoader from 'GLTFLoader';
import {* as global} from 'display.components';
import * as dayjs from 'dayjs';


namespace `display.screens` (
    class ModuleImportsTest extends Application {
        constructor(element){
            super(element);
            try{
                const loader = new GLTFLoader();
                console.log("GLTFLoader",GLTFLoader)
                console.log("TWEEN",TWEEN)
                console.log("Hello",ModuleA.hello)
                console.log("myExport",ModuleA.myExport)
                console.log("sample x",ModuleA.samplex)
                console.log("NodeTest",N.NodeTest)
                console.log("Query",Query)
                console.log("WristWatch",ModuleA.WristWatch)
                console.log("swal",swal);
                if(TWEEN&&ModuleA.hello&&ModuleA.myExport&&ModuleA.samplex&&N.NodeTest&&ModuleA.WristWatch){
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
