namespace `display.worlds.aeiou` (
	class GameOver extends WebComponent  {
		constructor(world, machine) {
            super();
            this.machine = machine;
            this.world=world;
            // this.music = new Audio("/src/resources/tunes/sawsquarenoise_-_10_-_Towel_Defence_Ending.mp3");
            // this.music.loop=true;
            // this.music.load();
            // this.onReset();
        }

        onReset(){
            this.isFinished = false;
            this.isStarted  = false;
            this.isBlocking = true;
            this.music.pause();
            this.music.currentTime=0;
        }

        async onConnected() {
            await super.onConnected();
            this.addEventListener("click", e => this.onTryAgain(), false, "#try_again");
        }

        onTryAgain(){
            this.isFinished=true;
            this.isBlocking=false;
        }
        
        // onPause() {this.paused=true;  this.music.pause();}

        // onResume(){this.paused=false; this.world.settings.music && this.music.play();}

        //----------------MACHINE
        onStart() {
            // this.world.settings.music && this.music.play();
            this.world.appendChild(this);
            this.isStarted=true;   
            console.log(this.namespace + " Started")
        }

        onAwake(){
            this.style.display="block";
            console.log(this.namespace + " Awake")
        }

        onSleep(){
            this.style.display="none";
            console.log(this.namespace + " Sleeping")
        }

        onEnd(){
            this.remove();
            this.machine.push(new display.worlds.aeiou.Level(this.world, this.machine));
            console.warn(this.namespace + " Ended");
            this.onReset();
        }

        onUpdate(time){
            
        }
	}
)