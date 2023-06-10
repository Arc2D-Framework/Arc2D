
namespace `ui.meld.editors` (
    class BranchingMenu extends ui.meld.editors.Editor {
        static get is() {return "branching-menu-editor"}
        
        async onConnected() {
            await super.onConnected();
        }

        inShadow() {
            return true
        }
    }
);