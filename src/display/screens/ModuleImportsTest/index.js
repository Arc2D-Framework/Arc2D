
// var myDefault = await import('/src/system/libs/modules/a.js');
var {TWEEN} = await import('/src/system/2d/tween.esm.js');
import {myExport,hello as Hello, runit} from '/src/system/libs/sample_modules/a.js';
import {NodeTest} from '/src/system/libs/sample_modules/nodejsmod.js';
import {wrist} from '/node_modules/od-watcher/wrist.js';
var mingo = (await require('/node_modules/od-mingo/dist/mingo.es6.js')).default;
import '/src/system/drivers/templating/Nunjucks/nunjucks-driver.js';
var {mustache} = await require('/src/system/drivers/templating/Mustache/mustache.js');
import '/src/system/libs/sample_modules/introjs.js';

namespace `display.screens` (
    class ModuleImportsTest extends w3c.ui.Application {
        constructor(element){
            super(element);
            console.log("TWEEN",TWEEN)
            console.log("myDefault",runit)
            console.log("NodeTest",NodeTest)
            console.log("wrist",wrist)
            console.log("mingo",mingo)
            console.log("nunjucks",nunjucks)
            console.log("mustache",mustache)
            console.log("intro",introJs)
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
