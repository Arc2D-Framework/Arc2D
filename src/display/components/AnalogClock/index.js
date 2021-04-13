import '@domain.models.Clock';

namespace `display.components` (
    class AnalogClock extends WebComponent {
        constructor(){
            super();
            this.model = new domain.models.Clock;
        }

        //this.hour is el with <.. id="hour" ..>
        onAutoQuerySelectIds(){return true}

        onUpdate(){
            this.model.onUpdate();
        }

        onDraw(){
            this.hour.style.transform   = `rotate(${this.model.hour}deg)`;
            this.minute.style.transform = `rotate(${this.model.minutes}deg)`;
            this.second.style.transform = `rotate(${this.model.seconds}deg)`;
        }
    }
);