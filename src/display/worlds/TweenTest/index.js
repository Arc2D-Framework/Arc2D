import! 'system.2d.Tween';
import! 'system.input.KeyBoard';
import! 'system.math.Utils';
var {Easing} = await import('/src/system/2d/Easing.js');


namespace `display.worlds` (
    class TweenTest extends World {
        async onConnected() {
            await super.onConnected();

            this.coords = {x: 0, y: 0};
            this.box = this.querySelector("#box")
            this.dest = {x: 300, y: 200};

            // this.t = new system["2d"].Tween(this.coords, TWEEN);
            // this.t.to({x: 300, y: 200}, 2000);
            // this.t.setEasing(TWEEN.Easing.Quadratic.Out);
            // this.t.start();
             // this.currentTime = 0;
             this.duration = 500;
             
        }

        onFixedUpdate = (time,delta) =>{
            if(this.box.ismoving){
                var elapsed = (Date.now() - this._timeStartedLerping);
                var percent = elapsed / this.duration;
                this.coords.x = Math.lerp(0, this.dest.x, Easing.Bounce.Out(percent),true);
                this.coords.y = Math.lerp(0, this.dest.y, Easing.Bounce.Out(percent),true);
                if(percent > 1) {
                    this.box.ismoving = false;
                }
            }
            // this.t.onUpdate(time,delta)
        }

        onUpdate=()=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this._timeStartedLerping = Date.now();
                    this.box.ismoving=true
                }
            }
        }

        onDraw = () => {
            this.box.style.setProperty('transform', 'translate(' + Math.round(this.coords.x) + 'px, ' + Math.round(this.coords.y) + 'px)');
        }
    }
);