import 'display.components.Splash';
import './options.js';


namespace `display.worlds` (
    class Dom3d extends World.with(DebugOptions) {
        async onConnected(){
            await super.onConnected();
            this.debug();
            this.lastMouseX=0;
            this.lastMouseY=0;
            this.rotX=0;
            this.rotY=0;
            this.wrapper = this.querySelector("#mainWrapper");
            document.addEventListener("mousedown",  e=> this.onMouseDown(e));
            document.addEventListener("mouseup",    e=> this.onMouseUp(e));
            document.addEventListener("mousemove",  e=> this.onMouseMove(e));
        }


        onMouseDown(e){
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.allow_rotation=true;
        }
        
        onMouseUp(){
            this.allow_rotation=false;
        }

        onMouseMove(e){
            if(this.allow_rotation){
                this.deltaX = e.pageX - this.lastMouseX;
                this.deltaY = e.pageY - this.lastMouseY;
                this.lastMouseX = e.pageX;
                this.lastMouseY = e.pageY;
                this.rotY -= this.deltaX * 0.2;
                this.rotX += this.deltaY * 0.2;
            }
        }

        onUpdate=()=>{
           //no update needed
        }

        onDraw=()=>{
            if(this.allow_rotation){
                this.wrapper.style.transform= `
                    rotateY( ${this.rotY}deg) 
                    rotateX(${-this.rotX}deg)
                `
            }
        }
    }
);
