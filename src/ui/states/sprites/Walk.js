import '@ui.states.sprites.Run';
var {Run} = ui.states.sprites;

namespace `ui.states.sprites` (
    class Walk extends MonoBehavior {
        onStart(){
            this.run = new Run(this.element);
        }

        onSleep(){
            console.log(this.namespace + " Sleeping");
        }

        onAwake(){
            console.log(this.namespace + " Awake");
            this.element.walk()
        }

        onUpdate(timestamp, delta){
            var dir = Input.getKeyHeld();
            this.lastX = this.element.x;
            this.lastY = this.element.y;
            var run = Input.getButtonDown(Input.run);;
            if(["left", "right"].includes(dir)){
                dir=="left"  && (this.element.direction=-1);
                dir=="right" && (this.element.direction=1);
                run && this.machine.push(this.run);
                this.element.x_velocity = this.element.velocity*delta;
                this.element.x += this.element.x_velocity*this.element.direction;
            }
            else {
                this.machine.pop(this);
            }
        }

        onDraw(interpolation){

		}
    }
);