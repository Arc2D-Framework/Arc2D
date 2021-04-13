import '@display.hud.states.State';
import '@display.hud.states.Walking';
import '@display.hud.states.Stretching';

namespace `display.hud.states` (
    class Conversation extends display.hud.states.State {
        constructor(sprite, machine, hero){
            super(sprite, machine);
            this.isFinished=false;
            this.duration=0;
            this.hero=hero;
            this.walking = new display.hud.states.Walking(sprite, machine);
            this.stretching = new display.hud.states.Stretching(sprite, machine);
		}

		stop() {
			this.clear();
			this.isAnimating=false;
		}

		clear(){
			this.sprite.classList.remove("idle");
		}

		

		



		



        




		//------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component.
        onAwake(){
            console.log(this.namespace + " Awake");
            // this.isAnimating=false;
            this.sprite.position.x = this.sprite.x;
            this.sprite.position.y = this.sprite.y;
            // this.sprite.classList.add("idle");
            // alert(this.sprite.x)
            
            console.log("Hi " + this.hero.classname);
            console.log("Max is facing " + this.hero.lastDir);
            this.sprite.classList.remove("left");
            this.sprite.classList.remove("right");
            this.sprite.classList.remove("up");
            this.sprite.classList.remove("down");

            if(this.hero.lastDir == "left"){
                this.sprite.classList.add("right");
                this.sprite.lastDir="right"
            }
            else if(this.hero.lastDir == "right"){
                this.sprite.classList.add("left");
                this.sprite.lastDir="left"
            }
            else if(this.hero.lastDir == "up"){
                this.sprite.classList.add("down");
                this.sprite.lastDir="down"
            }
            else if(this.hero.lastDir == "down"){
                this.sprite.classList.add("up");
                this.sprite.lastDir="up"
            }
        }

        //Machine puts it to sleep.
        onSleep(){
            console.log(this.namespace + " Sleeping");
            // this.isAnimating=false;
            this.isFinished=true;
            this.stop()
        }

        //Machine calls it once if never started
        onStart(dir) {
			// if(this.isAnimating){return}
			// this.isFinished=true;
			this.isStarted=true;
            console.log(this.namespace + " Started");
		}


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            console.log(this.namespace + " Exit")
            this.stop()
        }

        onDraw(){
            // this.sprite.style.transform = "translate3d(" + this.sprite.x + "px," + this.sprite.y + "px, 0px)";
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
       	onUpdate(timestamp, delta){
            
            this.duration += delta;
            if(this.duration >= 8000){
                // alert("you are blocking me")
                this.machine.pop(this);
                this.duration=0;
            }
        }
    }
);
