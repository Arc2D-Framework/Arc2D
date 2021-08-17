import '@system.input.KeyBoard';
import '@system.math.Utils';
import 'ui.hud.Max';

namespace `ui.worlds` (
    class SpriteSheets extends World {
        async onConnected() {
            await super.onConnected();

            this.hero = this.querySelector("hero-sprite");
            this.ready=true;
        }

        onFixedUpdate = (time,delta) =>{
            
        }

        onUpdate=(timestamp, delta)=>{

            this.ready&&this.hero.onUpdate(timestamp, delta);
            // const dir = KeyBoard.held_directions[0];
            // if (dir) {
            //     if (dir === KeyBoard.directions.right){
                    
            //     }
            // }
        }

        onDraw = (interpolation) => {
            this.ready&&this.hero.onDraw(interpolation);
            // var x = Math.round(this.coords.x);
            // var y = Math.round(this.coords.y);
            // this.box.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
        }
    }
);