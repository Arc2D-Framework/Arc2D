import '@domain.models.Clock';

namespace `display.components` (
    class AnalogClock extends WebComponent {
        constructor(){
            super();
            this.model = new domain.models.Clock;
        }

        async onConnected(){
            await super.onConnected();
            this.hHand = this.querySelector("#hour");
            this.mHand = this.querySelector("#minute");
            this.sHand = this.querySelector("#second");
            this.ready=true;
        }

        onUpdate(){
            this.model.onUpdate();
        }

        onDraw(){
            if(!this.ready){return}
            this.hHand.style.transform = "rotate(" + this.model.hour    + "deg)";
            this.mHand.style.transform = "rotate(" + this.model.minutes + "deg)";
            this.sHand.style.transform = "rotate(" + this.model.seconds + "deg)";
        }
    }
);