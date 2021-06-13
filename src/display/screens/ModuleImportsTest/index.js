import 'display.components.ToggleButton';
var {TWEEN} = await require('/src/system/physics/tween.esm.js');
import {* as ModuleA } from 'module-a';
import '/src/system/drivers/storage/Query.js';
import {* as N} from '/src/system/libs/sample_modules/nodejsmod.js';
var {NodeTest} = await require('/src/system/libs/sample_modules/nodejsmod.js');
// import '/node_modules/sweetalert/dist/sweetalert.min.js';
await require('/src/system/libs/sample_modules/introjs.js');
import {* as THREE} from '3d';
import GLTFLoader from 'GLTFLoader';
import * as dayjs from '/src/system/libs/sample_modules/day.js';
import {SampleDialog} from '/src/system/libs/sample_modules/SampleDialog/index.js';


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
                // console.log("swal",swal);
                if(TWEEN&&ModuleA.hello&&ModuleA.myExport&&ModuleA.samplex&&N.NodeTest&&ModuleA.WristWatch){
                    alert("Passed: ESM modules and components successfully imported");
                    this.modal = new SampleDialog;
                    this.modal.prompt()
                }
                else {
                    alert("Problems importing a module(s). See console"); 
                }
            } catch(e){
                alert("Problems importing a module(s). See console"); 
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
