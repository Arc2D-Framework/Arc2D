
namespace `ui.meld.editors` (
    class Tabs extends ui.meld.editors.Editor {
        static get is() {return "tabs-editor"}
        
        async onConnected() {
            await super.onConnected();
        }

        inShadow() {
            return true
        }
    }
);