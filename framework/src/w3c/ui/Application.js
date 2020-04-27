
import 'w3c.ui.WebComponent';

namespace `w3c.ui` (
	class Application extends w3c.ui.WebComponent {
	    constructor(el) {
	        super(el);
	        window.application = this;
	        window.sprites = [];
	        this.head           = document.getElementsByTagName("head")[0];
	        this.configscript   = document.querySelector("script[id='config']")||
	                              document.querySelector("script");
	    }

	    onUpdate(time){
            window.sprites.forEach(sprite => sprite.onUpdate(time))
        }

        onDraw(interpolation){
        	if(this.context){
        		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        	}
            window.sprites.forEach(sprite => sprite.onDraw(interpolation,this.context))
        }

        onEnd(fps, panic){
		    if (panic) {
		        var discardedTime = Math.round(MainLoop.resetFrameDelta());
		        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
		    }
        }

	    static define(proto, bool=true){
            super.define(proto,bool);      
        }

        async onConnected() {
            await this.render();
        }
	}
);
