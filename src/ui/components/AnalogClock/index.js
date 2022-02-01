import '@domain.models.Clock';

namespace `ui.components` (
    class AnalogClock extends Component {
        constructor(){
            super();
            this.model = new domain.models.Clock;
        }

        //runs many times per frame (physics/ai) at 8.333ms intervals. 
        onFixedUpdate (time) {}

        //runs once per frame (handle input/state updates) @16ms-24ms
        onUpdate(timestamp, delta){
            this.model.onUpdate();
        }

        // static preview(){
        //     var ns = this.prototype.namespace;
        //     window.open("/src/system/ui/ComponentViewer/index.html?ns="+ns)
        // }

        //runs once per frame AFTER onUpdate, (handle interpolation for fps-drop or lag) @16ms-24ms
        onDraw(interpolation){
            // if(this.isConnected) {
                this.hour.style.transform   = `rotate(${this.model.hour}deg)`;
                this.minute.style.transform = `rotate(${this.model.minutes}deg)`;
                this.second.style.transform = `rotate(${this.model.seconds}deg)`;
            // }
        }
    }
);