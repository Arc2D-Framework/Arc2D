import 'ui.hud.Sprite';
import '@system.machines.Automata';
import '@system.math.Vector';
import '@ui.hud.states.Patrol';
import '@ui.hud.states.Observation';
import '@ui.hud.states.Conversation';

@tag("npc-sprite");
namespace `ui.hud` (
    class Npc extends ui.hud.Sprite {
        constructor (element){
            super(element);
            let map = application.map;
            this.x=map.getX(5);
            this.y=map.getY(10);
            this.position = new system.math.Vector(this.x,this.y);
            this.width = 64;
            this.height = 64;
            this.bounds = [{x:20,y:52,width:24,height:9}]
            this.y_velocity = 0;
            this.x_velocity = 0;
            this.velocity=.05;
            this.direction=0;
            this.wayPoints = [
                new Vector(map.getX(8),map.getY(10)),
                new Vector(map.getX(5),map.getY(10)),
                new Vector(map.getX(5),map.getY(12)),
                new Vector(map.getX(5),map.getY(10))
             ];

            this.machine = new system.machines.Automata;
            // this.conversate = new ui.hud.states.Conversation(this,this.machine);
            this.patrol = new ui.hud.states.Patrol(this,this.machine);
            this.observe = new ui.hud.states.Observation(this,this.machine);
            this.machine.push(this.patrol);
            
            // this.walk = new experiments.tiled.animations.Walking("walk", this);
            // this.sfx_collide = new Audio("/resources/sounds/sfx_sounds_impact1.wav");
            // this.sfx_collide.loop=false;
            // this.sfx_collide.load();

        }

        async onConnected(){
            await super.onConnected();
        }

        onCollide(object){//displace hero away from object
            // this.sfx_collide.play()
            if(this.machine.state instanceof ui.hud.states.Conversation){return}
            else if(object instanceof ui.hud.Max){
                console.log("new conv")
                var conversate = new ui.hud.states.Conversation(this,this.machine,object);
                this.machine.push(conversate)
            }
            else {
                this.machine.push(this.patrol);
            }
            return;
            /*
            if(this.lastDir=="down" && object.lastDir == "up"){
                // this.y -= 3;
                // console.log("NPC path blocked by ", object);
                this.machine.push(this.observe)
            }
            else if(this.lastDir=="up" && object.lastDir == "down"){
                // this.y += 3;
                // console.log("NPC path blocked by ", object);
                this.machine.push(this.observe)
            }
            else if(this.lastDir=="left" && object.lastDir == "right"){
                // this.x += 3;
                // console.log("NPC path blocked by ", object);
                this.machine.push(this.observe)
            }
            else if(this.lastDir=="right" && object.lastDir == "left"){
                // this.x -= 3;
                // console.log("NPC path blocked by ", object);
                this.machine.push(this.observe)
            }
            else {
                this.machine.push(this.observe)
            }*/
        }

        onFixedUpdate(delta){
            this.machine.onFixedUpdate(delta);
        }

        onDraw(interpolation){
            this.machine.onDraw(interpolation);
        }
        
        onUpdate(timestamp, delta){
            this.machine.onUpdate(timestamp, delta);
        }
    }
);
