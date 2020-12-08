
namespace `docs.demos.game` (
    class Sprite extends WebComponent{
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
