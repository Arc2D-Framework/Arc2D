

namespace `domain.models` (
    class Clock {
        onUpdate(){
            var date = new Date();
            let hr  = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            console.log("Hour: "+hr+ " Minute: "+ min + " Second: "+ sec);

            //positions
            this.hour    = hr*360/12 + ((min * 360/60)/12) ;
            this.minutes = (min * 360/60) + (sec* 360/60)/60;
            this.seconds = sec * 360/60;
        }
    }
);
