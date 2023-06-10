
namespace `ui.meld.editors` (
    class Script extends ui.meld.editors.Editor {
        static get is() {return "script-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.editor = this.querySelector("code-editor");
            this.on("click",    e=> this.onErase(e), false, "nav #erase-btn");
            this.on("change",   e=> this.onSnippetsChanged(e), false, "select#snippets");
            this.onPopulateSnippets()
        }

        onPopulateSnippets() {
            var select = this.querySelector("select#snippets");
            for(var key in Config.OBJECT_TYPES) {
                // debugger
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