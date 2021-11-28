// import '@ui.states.sprites.Idle';
// var {Idle} = ui.states.sprites;

namespace `ui.states.sprites` (
    class Walk extends MonoBehavior {
        onStart(){
            // this.walk = new Idle(this.element);
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
            var run = dir == "space";
            if(dir){
                if(dir=="left"){
                    this.element.direction=-1;
                }
                if(dir=="right"){
                    this.element.direction=1;
                }
                if(run){
                    
                }
                this.element.x_velocity = this.element.velocity*delta + run?40:0;;
                this.element.x += this.element.x_velocity*this.element.direction;
            }
            !dir && this.machine.pop(this);
        }

        onDraw(interpolation){
            var x = this.element.x;
            var y = this.element.y;
            this.element.style.transform = `translate3d(${x}px, ${y}px, 0px) scaleX(${this.element.direction})`;
		}
    }
);