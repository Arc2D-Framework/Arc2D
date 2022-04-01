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
            if(dir && (dir=="left"||dir=="right")){
                // console.log("dir",dir);
                if(dir=="left"){
                    this.element.direction=-1;
                }
                else if(dir=="right"){
                    this.element.direction=1;
                }
                if(run){
                    this.machine.push(this.run);
                    return;
                }
                this.element.x_velocity = this.element.velocity*delta;
                this.element.x += this.element.x_velocity*this.element.direction;
                // var velocity = this.element.velocity*delta;
                // this.element.x += velocity * this.element.direction;
            }
            else {
                dir = null
            }
            !dir && this.machine.pop(this);
        }

        onDraw(interpolation){
            var x = this.element.x;
            var y = this.element.y;
            // var x = this.lastX + (this.element.x - this.lastX) * interpolation,
            //     y = this.lastY + (this.element.y - this.lastY) * interpolation;
            this.element.style.transform = `translate3d(${x}px, ${y}px, 0px) scaleX(${this.element.direction})`;
		}
    }
);