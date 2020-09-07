import '/src/system/game/physics/Box2D.js';
import! 'display.worlds.entities.html.Box2DEntity';
import 'display.worlds.entities.html.GroundBox';
import 'display.worlds.entities.html.PolygonShape';
import 'display.worlds.entities.svg.CircleShape';
import '/src/system/math/MathUUID.js';

var b2Vec2 = Box2D.Common.Math.b2Vec2
,   b2BodyDef = Box2D.Dynamics.b2BodyDef
,   b2Body = Box2D.Dynamics.b2Body
,   b2FixtureDef = Box2D.Dynamics.b2FixtureDef
,   b2Fixture = Box2D.Dynamics.b2Fixture
,   b2World = Box2D.Dynamics.b2World
,   b2MassData = Box2D.Collision.Shapes.b2MassData
,   b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
,   b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
,   b2DebugDraw = Box2D.Dynamics.b2DebugDraw
;
         


namespace `display.worlds` (
    class HelloDomNode extends World {

        //some code could be moved to cctor, oh well.
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();//waits for onConnect to run, see docs

            this.scale = 30;//scale is 30px per Meter 
            this.nodes=[];// [] for holding shape nodes in memory

            //make a world
            var world = this.world = new b2World(
                new b2Vec2(0, 20)    //gravity
                ,  true              //allow sleep
            );

            //using 2 canvases, one for svg circles and other for HTML
            this.stage = this.querySelector("#stage");
            this.svg = this.querySelector("#svg");

            //the ground, just an HTML box
            var ground = new display.worlds.entities.html.GroundBox(
                12,1,world,this.stage,this.scale
            );
            this.stage.appendChild(ground);// add ground to stage
                
            //generate 10 random Polygons
            for(var i = 0; i < 10; ++i) {
                var poly = new display.worlds.entities.html.PolygonShape(
                    Math.random() + 0.5,
                    Math.random() + 0.5,
                    world,
                    this.stage,
                    this.scale
                );
                //add it to list
                this.nodes.push(poly);
                //add it to stage
                this.stage.appendChild(poly)
             }

             //generate 10 random Circles
             for(var i = 0; i < 10; ++i) {
                var circle = new display.worlds.entities.svg.CircleShape(
                    Math.random() + 0.5,world,this.svg,this.scale
                );
                //add it to list
                this.nodes.push(circle);
                //add it to stage
                this.svg.appendChild(circle.element);
             }
             

             await wait(100);//a little breather after all that setup.
             this.ready=true;//now we are ready

             //setup debug draw -- optional
             var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
                debugDraw.SetDrawScale(30.0);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                world.SetDebugDraw(debugDraw);
        }

        //onUpdate steps (runs) at 60fps, called by Arc automatically every 1/60th frame
        onUpdate(time){
            if(!this.world||!this.ready){return}//world might not be ready yet, wait for next step, check again

            //step the world for this update. World handles physics update internally.
            this.world.Step(
                   1 / 40   //frame-rate, experimenting with 40fps
                ,  20       //velocity iterations
                ,  20       //position iterations
             );
             this.world.ClearForces();
        }

        //onDraw steps (runs) at 60fps 1/60th right after onUpdate runs, called by Arc automatically.
        onDraw(interpolation){
            if(this.world){//check again, make sure world is there
                this.world.DrawDebugData();//optional
                
                //loop list of nodes during this frame step, destroy or draw them
                for(var i=0; i<=this.nodes.length-1; i++){
                    var node = this.nodes[i];
                    //check! maybe node was deleted when it went off screen, splice it out, continue
                    if(!node) {this.nodes.splice(i,0); continue}
                    node.onDraw(); //else, subsequently tell node to onDraw() for this step (1/60th frame)
                    
                    //if any nodes/shapes fall of screen, destroy them
                    if(!this.isAnyPartOfElementInViewport(node)){
                        node.destroy();//destroy it, but still in list
                        delete this.nodes[i]; //and clean up list, leaves an empty spot in list though. see line 114
                    }
                }
            }
        }

        //helper function for checking if node goes off screen dimensions
        isAnyPartOfElementInViewport(el=this.root) {
            var rect = el.getBoundingClientRect();
            var v = (rect.top  <= window.innerHeight) && ((rect.bottom) >= 0);
            var h = (rect.left <= window.innerWidth)  && ((rect.right)  >= 0);
            return (v && h);
        }
    }
);
