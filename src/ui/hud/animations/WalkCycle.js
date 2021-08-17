import '@ui.hud.animations.Animation';


namespace `ui.hud.animations` (
    class WalkCycle extends ui.hud.animations.Animation {
        constructor(sprite){
        	super(name, sprite);
            this.sprite = sprite;
            // alert(this.sprite.x)
			// this.name   = name;
		}

		

		stop() {
			this.clear();
			this.isAnimating=false;
		}

		clear(){
			this.sprite.classList.remove("walking");
		}

		

		



		



        


		//------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            console.log(this.namespace + " Awake");
            this.isAnimating=true;
            this.sprite.classList.add("walking");
            // alert(this.sprite.x)
        }

        //Machine puts it to sleep.Usually hide itself, pause music, animate out.
        onSleep(){
            console.log(this.namespace + " Sleeping");
            this.isAnimating=false;
            this.stop()
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
            this.stop()
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
       	// onUpdate(timestamp, delta){
        //     // Key.isUp(Key.ESC) && this.dispatchEvent("startmenu")
        // }


        //onFixedUpdate, runs many times per frame. Good place for physics/collision/ai
        // onFixedUpdate(time) {}
        // lerp(min, max, fraction) {
        //     return (min-max) * fraction + min
        // }

        //onDraw, runs 1x per frame. Good place to paint
        onDraw(interpolation){
            // console.log(!this.sprite.iscolliding)
			if(this.isAnimating && !this.sprite.iscolliding){
				// this.clear();
				// this.sprite.classList.add(this.sprite.dirstr);
				
                var x = this.sprite.x;
                var y = this.sprite.y;
            // console.log(this.sprite)
                // debugger
				this.sprite.style.transform = "translate3d(" + x + "px," + y + "px, 0px)";
			}
		}
    }
);
