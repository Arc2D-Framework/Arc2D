
import '/src/domain/services/Meld.js';
import 'ui.components.SpaNav';
import 'ui.meld.FramesBrowser';
import 'ui.meld.editors.Editor';
import 'ui.meld.editors.Code';
import 'ui.meld.editors.Script';
import 'ui.meld.editors.RichText';
import 'ui.meld.editors.Branches';
import 'ui.meld.editors.Graphic';
import {parse} from "/src/libs/meld_parser.js";

namespace `ui.screens` (
    class Meld extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
            this.nav = this.querySelector("#nav");
            this.subscribe("frameselected", e=> this.onFrameSelected(e), false);
            this.editors_container = this.querySelector("#editors-container");
        }

        async onFrameSelected(e) {
            var frame = e.detail;
            var json = frame.Muse;
            var script = frame.Script;

            if(json) {
                this.editors_container.innerHTML = "";
                for(var key in json){
                    if(key == "id") {continue}
                    var data = json[key];
                    var ns = Config.OBJECT_TYPES[key.toUpperCase()]?.editor?.namespace;
                    if(ns) {
                        var cl = new system.http.ClassLoader;
                        await cl.import(ns);
                        var Class = NSRegistry[ns];
                        if(Class){
                            var editor = new Class;
                            editor.setData(data);
                            this.editors_container.append(editor)
                        }
                    }
                }

                this.outputScript(json)
            }
        }

        outputScript(json) {
            var code_editor = this.querySelector("#code-output-container code-editor");
                code_editor.setValue(parse(json))
        }

        // onResizeNavEnd(){

        // }
        // onResizeNav(e) {
            // const compStyles = window.getComputedStyle(this.nav);
            // var w = parseInt(compStyles.getPropertyValue("min-width"));
        //     console.log("w",w)
        //     this.nav.style.minWidth = (e.detail.delta) + "px"
        // }

        inShadow(){return false}
    }
);
