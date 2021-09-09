import 'ui.components.Splash';
import 'ui.components.AnalogClock';

/** <clock-app> is html tag for ClockApp class. May
be used in <body> to boot app, ex:

    <body namespace="ui.worlds.ClockApp">
        <clock-app></clock-app>
    </body>
*/

namespace `ui.worlds` (
    class ClockApp extends World {
        async onConnected(){
            await super.onConnected();//wait to be connected
            this.clock = new ui.components.AnalogClock;
            this.append(this.clock)
            
            // this.clock defined by onAutoQuerySelectIds(){}
            // this.on("connected", e=> this.ready=true);//wait for clock to connect
        }

        //ex: internally points this.clock to <analog-clock id="clock"></analog-clock>
        onAutoQuerySelectIds(){return true}
        
        //runs many times per frame (collision/physics/ai) at 8.333ms intervals within 1 "frame"
        onFixedUpdate = (time) =>{
            //not needed
            // console.log(time)
        }


        //runs once per frame (handle input/state updates), lasts for 16-24ms per frame
        //implement getSimulationTimestep(){ return 1000/120 } to control FPS
        onUpdate=(timestamp, delta)=>{
            // console.log(delta)
            this.isConnected && this.clock.onUpdate()
        }


        //runs once per frame after onUpdate; (handle interpolation for fps-drop or lag) - last 16-24ms per frame
        onDraw=(interpolation)=>{
            this.isConnected && this.clock.onDraw()
        }
    }
);
