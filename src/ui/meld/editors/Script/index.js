
namespace `ui.meld.editors` (
    class Script extends ui.meld.editors.Editor {
        static get is() {return "script-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.editor = this.querySelector("code-editor");
            this.on("codechanged", e=> this.onCodeChanged(e), false);
            this.on("click",    e=> this.onErase(e), false, "nav #erase-btn");
            this.on("change",   e=> this.onSnippetsChanged(e), false, "select#snippets");
            this.onPopulateSnippets();
        }

        onCodeChanged(e){
            // console.log("CODE CHANGED", e);
            this.museobject.value = e.detail.value;
            this.fire("framechanged", this.museframe)
        }

        onBind() {
            if(this.museobject){
                this.editor.setValue(this.museobject.value);
            }
        }

        onPopulateSnippets() {
            var select = this.querySelector("select#snippets");
            for(var key in Config.OBJECT_TYPES) {
                var o = Config.OBJECT_TYPES[key];
                if(o.example && o.enabled) {
                    var option = document.createElement("option");
                        option.text = o.label;
                        option.value = o.example;
                    select.append(option)
                }
            }
        }

        onErase() {
            this.editor.clear()
        }

        onSnippetsChanged(e){
            this.editor.append(e.matchedTarget.value)
        }

        inShadow() {
            return false
        }
    }
);