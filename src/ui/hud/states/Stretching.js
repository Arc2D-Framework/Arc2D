import '@ui.hud.states.State';
import '@ui.hud.states.Walking';

namespace `ui.hud.states` (
    class Stretching extends ui.hud.states.State {
        constructor(sprite, machine){
            super(sprite, machine);
            this.walking = new ui.hud.states.Walking(sprite, machine);
		}

		

		stop() {
			this.clear();
			this.isAnimating=false;
		}

		clear(){
			this.sprite.classList.remove("stretching");
		}

		

		



		



        


		//------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            console.log(this.namespace + " Awake");
            this.isAnimating=true;
            this.sprite.classList.add("stretching");
            // alert(this.sprite.x)
            setTimeout(e=>this.machine.pop(this),8000);
        }

        //Machine puts it to sleep.Usually hide itself, pause music, animate out.
        onSleep(){
            console.log(this.namespace + " Sleeping");
            this.isAnimating=false;
            this.stop();
            // alert("onSleep:walking")
        }

        //Machine calls it once if never started, hence the isStarted flag. Usually,
        //you append this component to DOM, which fires onConnected() above.
        onStart(dir) {
            // debugger;
			if(this.isAnimating){return}
            // this.sprite.classList.add("walking");
            // this.sprite.querySelector("img").style.animation = "moveSpritesheet .7s steps(9) infinite";
			this.isAnimating=true;
			this.isStarted=true;
            console.log(this.namespace + " Started");
            // console.log("onStart)")
		}


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            console.log(this.namespace + " Exit")
            this.stop();
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
        onUpdate(timestamp, delta){
            const dir = KeyBoard.held_directions[0];
            if(dir){
                this.machine.pop(this);
            }
        }
    }
);
