import '@ui.states.State';


namespace `ui.states` (
    class On extends ui.states.State {
        onStart(){
            // this.off = new ui.states.Off(this.element,this.machine);
            // this.element.button.classList.add("on")
        }

        onSleep(){
            this.element.button.classList.remove("on")
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.button.classList.add("on")
        }

        onUpdate(e){
            this.machine.pop(this)
            // this.isFinished=true;
            // this.machine.push(this.off);
        }
    }
)