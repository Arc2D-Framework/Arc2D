
import '/src/domain/services/Meld.js';
import 'ui.meld.ToolBar';
import 'ui.meld.FramesBrowser';
import 'ui.meld.editors.Editor';
import 'ui.meld.editors.Code';
import {parse} from "/src/libs/meld_parser.js";

namespace `ui.meld` (
    class Main extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
            this.nav = this.querySelector("#nav");
            this.editors_container = this.querySelector("#editors-container");
            this.code_editor = this.querySelector("#code-output-container code-editor");
            
            this.subscribe("frameselected", e=> this.onFrameSelected(e), false);
            this.subscribe("framechanged", e=> this.onFrameChanged(e), false);
            this.subscribe("objectselected", e=> this.onObjectSelected(e), false);
            this.on("editorselected", e=> this.onEditorSelected(e), false)
            
        }

        async onFrameChanged(e) {
            this.outputScript(e.detail)
        }

        async onFrameSelected(e) {
            this.clear()
            var frame = e.detail;
            var json = frame.Muse;
            var script = frame.Script;

            if(json) {
                for(var key in json){
                    if(key == "id") {continue}
                    var data = json[key];
                    var ns = Config.OBJECT_TYPES[key.toUpperCase()]?.editor?.namespace;
                    if(ns) {
                        var cl = new system.http.ClassLoader;
                        await cl.import(ns);
                        var Class = NSRegistry[ns];
                        if(Class){
                            var editor = new Class(data, json);
                                // editor.setData(data,json);
                            this.editors_container.append(editor)
                        }
                    }
                }
                this.outputScript(json)
            }
        }

        onObjectSelected(e) {
            var ns = e.detail.namespace;
            if(ns) {
                var editor = this.querySelector(`#editors-container > *[namespace='${ns}']`);
                if(editor) {
                    this.lastEditor && this.lastEditor.classList.remove("active");
                    this.lastEditor = editor;
                    this.lastEditor.classList.add("active");
                    // this.lastEditor.scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'start'});
                    this.editors_container.scroll({top: this.lastEditor.offsetTop-10, behavior: 'smooth'});
                }
            }
        }

        onEditorSelected(e) {
            this.lastEditor && this.lastEditor.classList.remove("active");
            this.lastEditor = e.detail.editor;
            this.lastEditor.classList.add("active")
        }

        clear() {
            this.editors_container.innerHTML = "";
            this.code_editor.clear();
        }

        outputScript(json) {
            this.code_editor.setValue(parse(json))
        }

        inShadow(){return false}
    }
);
