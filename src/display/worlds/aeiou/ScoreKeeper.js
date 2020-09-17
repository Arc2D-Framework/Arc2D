var {CountUp} = await require('/src/system/libs/countup.js');

namespace `display.worlds.aeiou` (
    class ScoreKeeper {
        constructor(world, machine) {
            this.machine = machine;
            this.world   = world;
            this.score = 0;
            this.onUpdateScore = this.onUpdateScore.bind(this);
            this.scorediv = world.querySelector("#score span");
            world.addEventListener("score", this.onUpdateScore, false);
            this.counter = new CountUp(this.scorediv, 1000/10, {startVal:this.score});
            this.onReset();
        }

        onUpdateScore(e){
            this.score += e.data.amount;
            this.counter.update(this.score)
        }

        onReset(){
            this.isFinished = false;
            this.isStarted = false;
        }

        onPause(){}
        
        onResume(){}
        
        //----------------MACHINE
        async onStart() {
            this.isStarted=true;   
            console.log(this.namespace + " Started")
        }

        onEnd(){
            world.removeEventListener("score", this.onUpdateScore, false);
            console.warn(this.namespace + " Ended");
            this.onReset();
        }

        onUpdate(){}
    }
);
