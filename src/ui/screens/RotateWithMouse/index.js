
namespace `ui.screens` (
    class RotateWithMouse extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            await this.onCalculateBoxCoordinates();
            this.addEventListener("mousemove", e => this.onRotate(e), true)
        }

        onCalculateBoxCoordinates(){
            let coords = this.box.getBoundingClientRect();
            this.box.center = {
                x : coords.left + coords.width/2, 
                y : coords.top  + coords.height/2
            }
        }

        onRotate(e){
            let angle = Math.atan2(e.pageX - this.box.center.x, - (e.pageY - this.box.center.y) )*(180 / Math.PI);	    
            this.box.style.transform = `rotate(${angle}deg)`;  
        }

        onAutoQuerySelectIds(){return true}//a reference to nodes with id's. Ex: this.box is ref to <div id="box"></div>
    }
);
