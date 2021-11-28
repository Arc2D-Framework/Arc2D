import '@ui.states.On';
var {On} = ui.states;

namespace `ui.states` (
    class Off extends MonoBehavior {
        onStart(){
            this.on = new On(this.element);
        }

        onSleep(){
            console.log(this.namespace + " Sleeping");
            this.element.button.classList.remove("off")
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.button.classList.add("off")
        }

        onUpdate(e){
            this.machine.push(this.on);
        }
    }
);