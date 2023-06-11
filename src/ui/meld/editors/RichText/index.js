
namespace `ui.meld.editors` (
    class RichText extends ui.meld.editors.Editor {
        static get is() {return "rich-text-editor"}
        
        async onConnected() {
            await super.onConnected();
            
            var quill = new Quill(this.querySelector("#editor"), {
                theme: 'snow'
            });
            this.editor = quill;
            this.editor.on('text-change', () => {
                this.museobject.value = this.editor.root.innerHTML;
                console.log('Text change!', this.editor.root.innerHTML);
                this.fire("framechanged", this.museframe)
            });
        }

        onBind() {
            if(this.museobject) {
                this.editor.pasteHTML(this.museobject.value)
            }
        }
    }
);