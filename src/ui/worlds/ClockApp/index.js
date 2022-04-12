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
            await super.onConnected();
        }
        // get isSimulation() {return true}

        // runs many times per frame (collision/physics/ai) at 8.333ms intervals within 1 "frame"
        onFixedUpdate = (time) =>{
            // if(this.isConnected) {
                this.component2d_instances && this.component2d_instances.forEach(c => c.onFixedUpdate(time))
            // }
        }


        //runs once per frame (handle input/state updates), lasts for 16-24ms per frame
        //implement getSimulationTimestep(){ return 1000/120 } to control FPS
        onUpdate=(timestamp, delta)=>{
            // console.log(delta)
            // if(this.isConnected) {
                // this.clock.onUpdate()
                this.component2d_instances && this.component2d_instances.forEach(c => c.onUpdate(timestamp, delta))
            // }
        }


        //runs once per frame after onUpdate; (handle interpolation for fps-drop or lag) - last 16-24ms per frame
        onDraw=(interpolation)=>{
            // this.isConnected && this.clock.onDraw()
            // if(this.isConnected) {
                // this.clock.onUpdate()
                this.component2d_instances && this.component2d_instances.forEach(c => c.onDraw(interpolation))
            // }
        }
    }
);
