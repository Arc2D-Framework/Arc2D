
namespace `ui.meld.editors` (
    class RichText extends ui.meld.editors.Editor {
        static get is() {return "rich-text-editor"}
        
        async onConnected() {
            await super.onConnected();
            var quill = new Quill(this.querySelector("#editor"), {
                theme: 'snow'
              });
        }
    }
);