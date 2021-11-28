
namespace `ui.states` (
    class State {
        constructor(element, machine){
            this.element = element;
            this.machine = machine;
		}

		//------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            console.log(this.namespace + " Awake");
            // alert(this.sprite.x)
        }

        //Machine puts it to sleep.Usually hide itself, pause music, animate out.
        onSleep(){
            console.log(this.namespace + " Sleeping");
        }

        //Machine calls it once if never started, hence the isStarted flag. Usually,
        //you append this component to DOM, which fires onConnected() above.
        onStart(dir) {
			this.isStarted=true;
            console.log(this.namespace + " Started");
		}


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            console.log(this.namespace + " Exit")
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
       	onUpdate(timestamp, delta){
            // Key.isUp(Key.ESC) && this.dispatchEvent("startmenu")
        }


        //runs many times per frame. Good place for physics/collision/ai
        onFixedUpdate(time) {

        }

        //runs 1x per frame. Good place to paint
        onDraw(interpolation){
            // console.log(!this.sprite.iscolliding)
		}
    }
);
