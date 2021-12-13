

namespace `ui.states.sprites` (
    class Run extends MonoBehavior {
        onStart(){
            // this.run = new Run(this.element);
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
            this.lastX = this.element.x;
            this.lastY = this.element.y;
            var run = Input.getButtonDown(Input.run);;
            if(run && dir){
                if(dir=="left"||dir=="right"){
                    if(dir=="left"){
                        this.element.direction=-1;
                    }
                    if(dir=="right"){
                        this.element.direction=1;
                    }
                    this.element.x += (run?25:0)*this.element.direction;
                }
            } else {
                this.machine.pop(this);
            }
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