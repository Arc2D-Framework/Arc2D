import '@ui.states.sprites.Walk';
var {Walk} = ui.states.sprites;

namespace `ui.states.sprites` (
    class Idle extends MonoBehavior {
        onStart(){
            this.walk = new Walk(this.element);
        }

        onSleep(){
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.idle()
        }

        onDraw(){

        }

        onUpdate(e){
            var dir = Input.getKeyHeld();
                dir && this.machine.push(this.walk)
        }
    }
);