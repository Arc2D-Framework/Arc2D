import 'display.components.Splash';
import 'display.components.AnalogClock';

/** The clock-demo app is a World (subclass of Application) which 
 * runs time dependent physics simulations onUpdate() @60fps*/
namespace `display.worlds` (
    class AnalogClockDemo extends World {
        async onConnected(){
            await super.onConnected();
            this.clock = this.querySelector("analog-clock");
            await wait(200);
            this.ready=true;
        }

        onUpdate=()=>{
            this.clock.onUpdate()
        }

        onDraw=()=>{
            this.ready && this.clock.onDraw()
        }
    }
);
