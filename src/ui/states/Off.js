import '@ui.states.State';


namespace `ui.states` (
    class Off extends ui.states.State {
        onStart(){
            this.on = new ui.states.On(this.element,this.machine);
        }

        onSleep(){
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
        }

        onUpdate(e){
            this.machine.push(this.on);
        }
    }
);