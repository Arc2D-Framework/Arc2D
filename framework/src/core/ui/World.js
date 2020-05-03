import 'w3c.ui.WebComponent';

namespace `core.ui` (
    class World extends w3c.ui.Application {
        constructor(el) {
            super(el);
            window.sprites = [];
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
    }
);
