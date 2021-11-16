import '@system.input.KeyBoard';
import '@system.math.Utils';
import 'ui.hud.Max';

namespace `ui.worlds` (
    class SpriteSheets extends World {
        async onConnected() {
            await super.onConnected();

            this.hero = this.querySelector("hero-sprite");
        }

        onFixedUpdate = (time,delta) =>{
            
        }

        onUpdate=(timestamp, delta)=>{
            this.isConnected && this.hero.onUpdate(timestamp, delta);
        }

        onDraw = (interpolation) => {
            this.isConnected && this.hero.onDraw(interpolation);
        }
    }
);