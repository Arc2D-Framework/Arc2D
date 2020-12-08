
namespace `core.ui.game` (
    class Sprite extends w3c.ui.WebComponent{
        constructor (element){
            super(element);
        }

        onConnected(){
            this.render();
        }

        inShadow() {
            return false
        }
    }
);
