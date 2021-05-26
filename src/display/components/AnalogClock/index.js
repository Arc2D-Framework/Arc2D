import '@domain.models.Clock';

namespace `display.components` (
    class AnalogClock extends WebComponent {
        constructor(){
            super();
            this.model = new domain.models.Clock;
        }

        // async onConnected(){
        //     await super.onConnected();//wait to be connected
        //     this.ready=true;
        // }

        //ex: sets up this.hour to el <g id="hour" ... >
        onAutoQuerySelectIds(){return true}

        //runs many times per frame (physics/ai) at 8.333ms intervals
        onFixedUpdate = (time) =>{
            //not needed
        }

        //runs once per frame (handle input/state updates) @16ms-24ms
        onUpdate(timestamp, delta){
            this.model.onUpdate();
        }

        //runs once per frame (handle interpolation for fps-drop or lag) @16ms-24ms
        onDraw(interpolation){
            if(this.isConnected) {
                this.hour.style.transform   = `rotate(${this.model.hour}deg)`;
                this.minute.style.transform = `rotate(${this.model.minutes}deg)`;
                this.second.style.transform = `rotate(${this.model.seconds}deg)`;
            }
        }
    }
);