
namespace `ui.meld.editors` (
    class Swaps extends ui.meld.editors.Editor {
        static get is() {return "swaps-editor"}
        
        async onConnected() {
            await super.onConnected();
        }

        inShadow() {
            return true
        }
    }
);