// import '@system.input.KeyBoard';
// import '@system.math.Utils';
import 'ui.components.Sonic';
import '@ui.renderers.CanvasRenderer';
import '@ui.renderers.StyleRenderer';

namespace `ui.worlds` (
    class SonicSpriteDemo extends World {
        static get is(){
            return "sonic-sprite-demo"
        }
        async onConnected() {
            await super.onConnected();


            this.sonic = new ui.components.Sonic(null,{
                x:0, 
                y: 0,
                width: 107,
                height: 120,
                renderer : ui.renderers.StyleRenderer
            });
            await this.append(this.sonic);
            // this.sonic.idle()

            this.sonic2 = new ui.components.Sonic(null,{
                x:0, 
                y: 0,
                width: 114,
                height: 120,
                renderer : ui.renderers.CanvasRenderer
            });
            await this.append(this.sonic2);
            // this.sonic2.idle();



            // this.sonic3 = new ui.components.Sonic(null,{
            //     x:0, 
            //     y: 0,
            //     width: 114,
            //     height: 120,
            //     renderer : ui.renderers.CanvasRenderer
            // });
            // await this.append(this.sonic3);
            // this.sonic3.run()
            
        }

        onFixedUpdate = (time,delta) =>{
            
        }

        onUpdate=(timestamp, delta)=>{
            if(this.isConnected) {
                this.sonic.onUpdate(timestamp, delta);
                this.sonic2.onUpdate(timestamp, delta);
                // this.sonic3.onUpdate(timestamp, delta);
            }
        }

         onDraw = async (interpolation) => {
            if(this.isConnected) {
                this.sonic.onDraw(interpolation)
                this.sonic2.onDraw(interpolation)
                // this.sonic3.onDraw(interpolation)
            }
        }
    }
);