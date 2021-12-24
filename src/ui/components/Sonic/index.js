import '@system.input.Gamepad';
import '@ui.states.sprites.Idle';
var {Idle} = ui.states.sprites;

namespace `ui.components` (
    class Sonic extends Component2D {
        static get is(){
            return 'sonic-sprite'
        }

        constructor(el,options={}) {
            super(el,options);
            this.options = options;
            this.image = options.image||new Image();
            this.image.src = "/src/ui/components/Sonic/spritesheet.png";
            this.velocity = .3;
            this.y_velocity = 0;
            this.x_velocity = 0;
            this.direction = 0;
            this.behaviors.push(new Idle(this))
        }

        async onConnected(options=this.options){
            await super.onConnected();
            this.image = options.image||this.image; // Path to image sprite sheet
            this.x = options.x; // Coordinates on canvas
            this.y = options.y;
            this.width = options.width; // Size of sprite frame
            this.height = options.height;
        }

        async onAwake(){
            
        }

        onRendered(){
            console.log("onRendered " + this.namespace)
            this.renderer = new this.options.renderer(this);
        }

        walk() {
            this.frames = 8;
            this.frameIndex = 0;
            this.row = 1;
            this.ticksPerFrame = 60;
        }

        idle() {
            this.frames = 9;
            this.frameIndex = 0;
            this.row = 0;
            this.ticksPerFrame = 260;
        } 

        run() {
            this.frames = 4;
            this.frameIndex = 0;
            this.row = 2;
            this.ticksPerFrame = 1;
        }  

        onUpdate(timestamp, delta){
            this.renderer && this.renderer.onUpdate(timestamp, delta);
            this.behaviors.onUpdate(timestamp, delta);
        }

        async onDraw(interpolation){
            this.renderer && this.renderer.onDraw(interpolation);
            this.behaviors.onDraw(interpolation);
        }
    }
)