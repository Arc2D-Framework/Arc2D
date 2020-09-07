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
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.scale = 30;
            this.nodes=[];

            var world = this.world = new b2World(
                new b2Vec2(0, 20)    //gravity
                ,  true              //allow sleep
            );
            this.stage = this.querySelector("#stage");
            this.svg = this.querySelector("#svg");

            var ground = new display.worlds.entities.html.GroundBox(
                12,1,world,this.stage,this.scale
            );
            this.stage.appendChild(ground)
                
             for(var i = 0; i < 10; ++i) {
                var poly = new display.worlds.entities.html.PolygonShape(
                    Math.random() + 0.5,
                    Math.random() + 0.5,
                    world,
                    this.stage,
                    this.scale
                );
                this.nodes.push(poly);
                this.stage.appendChild(poly)
             }
             for(var i = 0; i < 10; ++i) {
                var circle = new display.worlds.entities.svg.CircleShape(
                    Math.random() + 0.5,world,this.svg,this.scale
                );
                this.nodes.push(circle);
                this.svg.appendChild(circle.element);
             }
             

             await wait(100);
             this.ready=true;

             //setup debug draw
             var debugDraw = new b2DebugDraw();
                debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
                debugDraw.SetDrawScale(30.0);
                debugDraw.SetFillAlpha(0.3);
                debugDraw.SetLineThickness(0);
                debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
                world.SetDebugDraw(debugDraw);
                // console.log("bodies",this.world.GetBodyList())
        }

        onUpdate(time){
            if(!this.world||!this.ready){return}

            this.world.Step(
                   1 / 40   //frame-rate
                ,  20       //velocity iterations
                ,  20       //position iterations
             );
             this.world.ClearForces();
        }

        onDraw(interpolation){
            if(this.world){
                this.world.DrawDebugData();
                // console.log("bodies",this.world.GetBodyList())
                // for ( var body = this.world.GetBodyList()){
                //       //do something with the body 'b'
                //       console.log(body)
                // }
                // for ( var b = this.world.GetBodyList(); b; b = b.GetNext())
                //   {
                //       // console.log(b.GetAngle()* (180/Math.PI))
                //   }
                for(var i=0; i<=this.nodes.length-1; i++){
                    var node = this.nodes[i];
                    if(!node) {this.nodes.splice(i,0); continue}
                    node.onDraw();
                    if(!this.isAnyPartOfElementInViewport(node)){
                        node.destroy();
                        delete this.nodes[i];
                    }
                }
            }
        }

        isAnyPartOfElementInViewport(el=this.root) {
            var rect = el.getBoundingClientRect();
            var v = (rect.top  <= window.innerHeight) && ((rect.bottom) >= 0);
            var h = (rect.left <= window.innerWidth)  && ((rect.right)  >= 0);
            return (v && h);
        }
    }
);
