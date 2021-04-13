import 'display.hud.Sprite';
import '@system.machines.Automata';
import '@display.hud.states.Idle';

@tag("hero-sprite");
namespace `display.hud` (
    class Max extends display.hud.Sprite {
        constructor (element){
            super(element);
            this.x=100;
            this.y=210;
            // this.lastX=0;
            // this.lastY=0;
            this.width = 64;
            this.height = 64;
            this.bounds = [{x:20,y:52,width:24,height:9}]
            this.velocity = .1;
            this.y_velocity = 0;
            this.x_velocity = 0;
            this.direction=0;
            this.machine = new system.machines.Automata;
            this.idle = new display.hud.states.Idle(this,this.machine);
            this.machine.push(this.idle);
            window.max=this;
            // this.walking = new display.hud.states.Walking(this);
            // this.walk_left = new display.hud.animations.WalkCycle("left", this);
            // this.walk_up = new display.hud.animations.WalkCycle("up", this);
            // this.walk_down = new display.hud.animations.WalkCycle("right", this);

            // this.sfx_collide = new Audio("../../../resources/sfx/sfx_sounds_impact1.wav");
            // this.sfx_collide.loop=false;
            // this.sfx_collide.load();
            this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0px)`
        }

        async onConnected(){
            await super.onConnected();
        }

        onCollide(object){//displace hero away from object
            // this.sfx_collide.play()
            // console.log(this.lastDir)
            // var npc = display.hud.Npc;
            // if(object instanceof npc){return}
            if(this.lastDir=="down"){
                this.y -= 2;
            }
            else if(this.lastDir=="up"){
                this.y += 2;
            }
            else if(this.lastDir=="left"){
                this.x += 2;
            }
            else if(this.lastDir=="right"){
                this.x -= 2;
            }
        }

        onFixedUpdate(delta){
            
        }

        onDraw(interpolation){
            this.machine.onDraw(interpolation);
        }
        
        onUpdate(timestamp, delta){
            this.machine.onUpdate(timestamp, delta);
        }
    }
);
