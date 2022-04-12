

namespace `ui.states.sprites` (
    class Run extends MonoBehavior {
        onStart(){

        }

        onSleep(){
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.run()
        }

        onUpdate(timestamp, delta){
            var dir = Input.getKeyHeld();
            var run = Input.getButtonDown(Input.run);;
            if(run && dir){
                if(["left","right"].includes(dir)){
                    dir=="left"  && (this.element.direction=-1);
                    dir=="right" && (this.element.direction=1);
                    this.element.x += (run ? this.element.speed:0) * this.element.direction;
                }
                else {
                    this.machine.pop(this);
                }
            } 
            else {
                this.machine.pop(this);
            }
        }

        onDraw(interpolation){

		}
    }
);