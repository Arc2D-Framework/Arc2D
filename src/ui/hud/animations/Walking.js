import '@ui.hud.animations.Animation';


namespace `ui.hud.animations` (
    class Walking extends ui.hud.animations.Animation {
        constructor(name, sprite){
        	super(name, sprite);
			this.sprite = sprite;
			this.name   = name;
		}

		

		stop() {
			this.clear();
			this.isAnimating=false;
		}

		clear(){
			this.sprite.classList.remove(this.name+"-right");
			this.sprite.classList.remove(this.name+"-left");
			this.sprite.classList.remove(this.name+"-up");
			this.sprite.classList.remove(this.name+"-down");
		}

		

		



		



        


		//------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            console.log(this.namespace + " Awake");
            this.isAnimating=true;

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
			if(this.isAnimating){return}
			this.sprite.classList.remove(this.name+"-"+this.sprite.dirstr);
			this.isAnimating=true;
			this.isStarted=true;
			console.log(this.namespace + " Started");
		}


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            console.log(this.namespace + " Exit")
            this.stop()
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
       	onUpdate(timestamp, delta){
            // Key.isUp(Key.ESC) && this.dispatchEvent("startmenu")
        }


        //onFixedUpdate, runs many times per frame. Good place for physics/collision/ai
        onFixedUpdate(time) {}

        //onDraw, runs 1x per frame. Good place to paint
        onDraw(interpolation){
			if(this.isAnimating && !this.sprite.iscolliding){
				this.clear();
				this.sprite.classList.add(this.name+"-"+this.sprite.dirstr);
				
                var x = Math.round(this.sprite.x);
                var y = Math.round(this.sprite.y);

				this.sprite.style.transform = "translate3d(" + x + "px," + y + "px, 0px)";
			}
		}
    }
);
