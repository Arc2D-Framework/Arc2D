import 'ui.components.Splash';
import 'ui.components.SingleSelect';
import 'ui.components.MultiSelect';
var {SingleSelect, MultiSelect} = ui.components;


namespace `ui.screens` (
    class CustomSelectDemo extends Application {
        
        async onConnected() {
            await super.onConnected();
            var ss = new SingleSelect("My Single Select", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);
            ss.on("change", e=> this.onChange(e), true);

            var ms = new MultiSelect("My MultiSelect", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);

            application.appendChild(ss);
            application.appendChild(ms);
        }

        onChange(e){
            console.log("single select updated!: " + e.data.display)
            console.log(e)
        }

        // onFixedUpdate =(time) =>{
           
        // }


        // //runs once per frame (handle input/state updates), lasts for 16-24ms per frame
        // //implement getSimulationTimestep(){ return 1000/120 } to control FPS
        // onUpdate=(timestamp, delta)=>{
            
        // }


        // //runs once per frame after onUpdate; (handle interpolation for fps-drop or lag) - last 16-24ms per frame
        // onDraw =(interpolation)=>{
        //     // console.log(this)
        // }

        // onUpdateEnd(fps, panic){
            
        // }
    }
);
