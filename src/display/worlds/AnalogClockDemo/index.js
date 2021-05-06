import 'display.components.Splash';
import 'display.components.AnalogClock';

/** The clock-demo app is a World (subclass of Application) which 
 * runs time dependent physics simulations onUpdate() @60fps*/
namespace `display.worlds` (
    class AnalogClockDemo extends World {
        async onConnected(){
            await super.onConnected();
            this.clock = this.querySelector("analog-clock");//find the clock component
            this.clock.on("connected", e=> this.ready=true);//wait for clock to connect (w3c connected state, see docs)
        }

        
        //runs many times per frame (collision/physics/ai) at 8.333ms intervals within a 1 "frame"
        onFixedUpdate = (time) =>{
            //not needed
            // console.log(time)
        }


        //runs once per frame (handle input/state updates) last 16-24ms per frame
        //implement getSimulationTimestep(){ return 1000/120 } to control FPS
        onUpdate=(timestamp, delta)=>{
            // console.log(delta)
            this.ready && this.clock.onUpdate()
        }


        //runs once per frame (handle interpolation for fps-drop or lag) - last 16-24ms per frame
        onDraw=(interpolation)=>{
            this.ready && this.clock.onDraw()
        }
    }
);
