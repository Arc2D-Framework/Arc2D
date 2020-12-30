
//mport! 'display.worlds.aeiou.Challenge';
//mport! 'display.worlds.aeiou.DamageMeter';

namespace `display.worlds.fruits` (
    @tag("level-one");
    class Level extends WebComponent {
        constructor(world, machine) {
            super();
            this.machine = machine;
            // this.actions = new display.worlds.aeiou.Machine;
            this.world=world;
            // this.music = new Audio("/resources/tunes/sawsquarenoise_-_02_-_Towel_Defence_Comic.mp3");
            // this.music.loop=true;
            // this.music.load();
            this.fruits = [
                {src:"apple.png"},
                {src:"orange.png"},
                {src:"bread.png"},
                {src:"celery.png"},
                {src:"coconut.png"},
                {src:"gem.png"},
                {src:"milk.png"}
            ]
            this.onReset();
        }

        onReset(){
            this.isFinished = false;
            this.isStarted=false;
        }

        async onConnected() {
            await super.onConnected(this.makeFruits());
            // this.onGameOver = this.onGameOver.bind(this);
            // this.world.addEventListener("gameover", this.onGameOver, false);
            // this.canvas = this.querySelector("#canvas");
            // this.addEventListener("click", e => this.onPauseMenu(), false, "#pause");
            // this.addEventListener("click", e => this.onEndLevel(), false, "#exit");
            // this.addEventListener("click", e => this.onScored(e), false, "#inc-score");
            // this.addEventListener("challengedone", e => this.onChallengeDone(e));
            // this.addEventListener("failed", e => this.onFailedChallenge(e));
            
            // this.actions.push(new display.worlds.aeiou.Challenge(this.world, this, this.machine));
            // this.actions.push(new display.worlds.aeiou.ScoreKeeper(this.world, this.machine));
            // this.actions.push(new display.worlds.aeiou.DamageMeter(this.world, this.machine));
        }

        random(min, max) { // min and max included 
          return Math.floor(Math.random() * (max - min + 1) + min);
        }

        makeFruits(){
            var res = [];
            for(var i=0; i<=34; i++){
                res.push(this.fruits[this.random(0,this.fruits.length-1)])
            }
            return res;
        }

        // onEndLevel(){
        //     this.isFinished=true
        //     this.dispatchEvent("gameover");
        //     this.music.pause();
        // }

        // onGameOver(){
        //     this.isFinished=true;
        //     this.music.pause();
        // }

        // onFailedChallenge(){
        //     //TODO: Could be used to decrement lives as a feature (?)
        // }

        // onChallengeDone(){
        //     var doit = !this.isFinished && confirm("Try the next Challenge?")
        //         doit && this.actions.push(new display.worlds.aeiou.Challenge(this.world, this, this.machine));
        // }

        // onPauseMenu(){
        //     // this.machine.push(new display.worlds.aeiou.Menu(this.world, this.machine));
        //     this.dispatchEvent("pausegame")
        // }

        // onScored(e){
        //     this.dispatchEvent("score", {amount:42});
        // }

        // append(vowel){
        //     this.canvas.appendChild(vowel)
        // }
        
        



        //----------------------MACHINE-------------------------
        onAwake(){
            this.style.display="block";
            console.log(this.namespace + " Awake")
            // this.music.play();
        }

        onSleep(){
            this.style.display="none";
            console.log(this.namespace + " Sleeping");
            // this.music.pause();
        }

        onStart() {
            // this.world.settings.music && this.music.play();
            this.world.appendChild(this)
            this.isStarted=true;   
            console.log(this.namespace + " Started")
        }

        onExit(){
            this.remove();
            console.log(this.namespace + " Exit")
            this.music.pause();
        }

        onUpdate=(time)=>{
            // this.actions.onUpdate();
        }
    }
);
