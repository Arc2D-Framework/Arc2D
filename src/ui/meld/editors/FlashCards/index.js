
namespace `ui.meld.editors` (
    class FlashCards extends ui.meld.editors.Editor {
        static get is() {return "flash-cards-editor"}
        
        async onConnected() {
            await super.onConnected();
        }

        inShadow() {
            return true
        }
    }
);