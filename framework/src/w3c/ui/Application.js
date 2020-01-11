
import 'w3c.ui.WebComponent';

namespace `w3c.ui` (
	class Application extends w3c.ui.WebComponent {
	    constructor() {
	        super();
	        window.sprites = [];
	        window.application = this;
	        this.head           = document.getElementsByTagName("head")[0];
	        this.configscript   = document.querySelector("script[id='config']")||
	                              document.querySelector("script");
	        // this._onUpdate = this.onUpdate.bind(this);
	    }

	    onUpdate(time){
            window.sprites.forEach(sprite => sprite.onUpdate(time))
            // window.requestAnimationFrame(this._onUpdate);
        }

        onDraw(interpolation){
        	// console.log("onDraw",this.context)
        	if(this.context){
        		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        	}
        	// console.log("onDraw",this)
            window.sprites.forEach(sprite => sprite.onDraw(interpolation,this.context))
            // window.requestAnimationFrame(this._onUpdate);
        }

        onEnd(fps, panic){
        	//console.log(Math.round(fps) + ' FPS');
		    if (panic) {
		        // This pattern introduces non-deterministic behavior, but in this case
		        // it's better than the alternative (the application would look like it
		        // was running very quickly until the simulation caught up to real
		        // time). See the documentation for `MainLoop.setEnd()` for additional
		        // explanation.
		        var discardedTime = Math.round(MainLoop.resetFrameDelta());
		        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
		    }
        }



	    static define(proto, bool=true){
            super.define(proto,bool);      
        }

        onConnected() {
            this.render();
            // window.sprites = [];
            // setTimeout(_=>window.requestAnimationFrame(this._onUpdate),300);
        }
	}
);
