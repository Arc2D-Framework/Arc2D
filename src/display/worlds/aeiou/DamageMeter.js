namespace `display.worlds.aeiou` (
    class DamageMeter {
        constructor(world, machine) {
            this.machine = machine;
            this.world   = world;
            this.hp = world.querySelector("#hp meter");
            this.onDamageTaken = this.onDamageTaken.bind(this);
            world.addEventListener("damage", this.onDamageTaken, false);
            this.onReset();
        }

        onDamageTaken(e){
            this.hp.value -= e.data.amount;
            this.hp.value <= 0 && (this.isFinished=true)
        }
      
        onReset(){
            this.isFinished = false;
            this.isStarted = false;
        }

        onPause(){}
        
        onResume(){}
        
        //----------------MACHINE
        async onStart() {
            this.hp.value=100;
            this.isStarted=true;   
            console.log(this.namespace + " Started")
        }

        onEnd(){
            this.world.removeEventListener("damage", this.onDamageTaken,false);
            this.world.dispatchEvent("gameover");
            console.warn(this.namespace + " Ended");
            this.onReset();
        }

        onUpdate(){}
    }
);
