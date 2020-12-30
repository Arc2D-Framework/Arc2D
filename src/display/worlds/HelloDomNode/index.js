import '/src/system/physics/b2d/Box2D.js';
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

        constructor(element){
            super(element);
            this.scale = 30;//scale is 30px per Meter 
            this.nodes=[];  //for holding shapes

            //make a world
            this.world = new b2World(
                new b2Vec2(0, 20)    //gravity
                ,true                //allow sleep
            );
        }

        async onConnected() {
            await super.onConnected();//waits for onConnect to run, see docs
            this.fpsCounter = this.querySelector('#fpscounter');

            //using 3 canvases, one for svg circles 1 for HTML and Canvas for debug
            this.stage = this.querySelector("#stage");
            this.svg = this.querySelector("#svg");
            this.canvas = document.getElementById("canvas");

            //the ground, just an HTML box
            var ground = new display.worlds.entities.html.GroundBox(
                12, 
                1, 
                this.world, 
                this.stage, 
                this.scale
            );
            //add ground to stage
            this.stage.appendChild(ground);
                
            //generate 10 random Polygons
            for(var i = 0; i < 10; ++i) {
                var poly = new display.worlds.entities.html.PolygonShape(
                    Math.random() + 0.5,
                    Math.random() + 0.5,
                    this.world,
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
                    Math.random() + 0.5,
                    this.world,
                    this.svg,
                    this.scale
                );
                //add it to list
                this.nodes.push(circle);
                //add it to stage
                this.svg.appendChild(circle.element);
             }
             
             //breathe
             await wait(1000);
             this.querySelector("#container").style.display="inline-block"
             //ready
             this.ready=true;
             //optional debug
             this.setupCanvasDebug();
        }

        //affected by time. called zero or more times per frame depending on the frame rate
        onFixedUpdate = (time) =>{
            // console.log(time/60)
            if(!this.world||!this.ready){return}//world might not be ready yet, wait for next step, check again

            //step the world for this update. World handles physics update internally.
            this.world.Step(
                   time/650 //time siumlated in seconds or 1/40
                ,  20       //velocity iterations
                ,  20       //position iterations
             );
             this.world.ClearForces();
        }


        onDraw = (interpolation) =>{
            if(this.world){//check again, make sure world is there
                this.world.DrawDebugData();//optional
                
                //loop list of nodes during this frame step, destroy or draw them
                for(var i=0; i<=this.nodes.length-1; i++){
                    var node = this.nodes[i];
                    //check! maybe node was deleted when it went off screen, splice it out, continue
                    if(!node) {this.nodes.splice(i,0); continue}
                    node.onDraw(interpolation); //else, subsequently tell node to onDraw() for this step (1/60th frame)
                    
                    //if any nodes/shapes fall of screen, destroy them
                    if(!this.isAnyPartOfElementInViewport(node)){
                        node.destroy();//destroy it, but still in list
                        delete this.nodes[i]; //and clean up list, leaves an empty spot in list though. see line 114
                    }
                }
            }
        }

        onUpdateEnd = (fps, panic) => {
            super.onUpdateEnd(fps, panic);
            if(this.fpsCounter){
                this.fpsCounter.textContent = Math.round(fps) + ' FPS';
            }
        }

        //optional
        setupCanvasDebug(){
            //setup b2 debug draw
             var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(this.canvas.getContext("2d"));
                debugDraw.SetDrawScale(30.0);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                this.world.SetDebugDraw(debugDraw);
        }
    }
);
