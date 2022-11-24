
namespace `ui.states` (
    class On extends MonoBehavior {
        onStart(){

        }

        onSleep(){
            this.element.button.classList.remove("on")
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.button.classList.add("on")
            this.element.dispatchEvent("changed", {on:true})
        }

        onUpdate(e){
            this.machine.pop(this)
        }
    }
);