import! 'system.input.KeyBoard';
import! 'system.math.Utils';
var {Easing} = await import('/src/system/math/Easing.js');


namespace `display.worlds` (
    class TweenTest extends World {
        async onConnected() {
            await super.onConnected();

            this.coords = {x: 0, y: 0};
            this.box = this.querySelector("#box")
            this.dest = {x: 300, y: 200};
            this.duration = 500;
             
        }

        onFixedUpdate = (time,delta) =>{
            if(this.box.ismoving){
                var elapsed = (Date.now() - this.starttime);
                var percent = elapsed / this.duration;
                this.coords.x = Math.lerp(0, this.dest.x, Easing.Bounce.Out(percent),true);
                this.coords.y = Math.lerp(0, this.dest.y, Easing.Bounce.Out(percent),true);
                if(percent > 1) {
                    this.box.ismoving = false;
                }
            }
        }

        onUpdate=()=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this.starttime = Date.now();
                    this.box.ismoving=true
                }
            }
        }

        onDraw = () => {
            var x = Math.round(this.coords.x);
            var y = Math.round(this.coords.y);
            this.box.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
        }
    }
);