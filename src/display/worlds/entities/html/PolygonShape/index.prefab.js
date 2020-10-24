
                
namespace `display.worlds.entities.html` (
    class PolygonShape extends display.worlds.entities.html.Box2DEntity {
        // constructor(hWidth,hHeight,world,stage,scale,element){
        //     super(element);
        //     this.hw     =hWidth;
        //     this.hh     =hHeight;
        //     this.world  =world;
        //     this.scale  =scale;
        //     this.stage  =stage;
        // }

        onLoadInstanceStylesheet(){return false}

        async onConnected(){
            // await super.onConnected();
            await this.render()
            var fixDef = new b2FixtureDef;
                fixDef.density = 3.0;
                fixDef.friction = 0.2;
                fixDef.restitution = 0.2;
             
            var bodyDef = this.bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position.x = Math.random() * 3;
                bodyDef.position.y = Math.random() * 3; 
             fixDef.shape = new b2PolygonShape;
             fixDef.shape.SetAsBox(this.hw,this.hh);
             this.body = this.world.CreateBody(bodyDef);
             this.body.CreateFixture(fixDef);
             // this.world.CreateBody(bodyDef).CreateFixture(fixDef);
             // alert(this.body.GetPosition().x)

             // var angle = this.body.GetAngle();
             // var deg = angle * (180/Math.PI);
             // this.style.transform = `translate3d(${(bodyDef.position.x-(this.hw))*this.scale}px, ${(bodyDef.position.y-(this.hh))*this.scale}px, 0px)`;
             this.style.width = (this.hw*2)* (this.scale)+"px";
             this.style.height= (this.hh*2)* (this.scale)+"px";

        }

        cssStyle(){
            return super.cssStyle() + `
                .PolygonShape {
                    background:#a5e002;
                    /*display:none;*/
                    transform-origin: center;
                }
            `
        }

        destroy(){
            this.world.DestroyBody(this.body);
            this.remove()
            // this.bodyDef=null;
            // this.body=null;
        }

        onDraw(){
            if(!this.body){return}
            // if(this.body.IsSleeping()){return}
            var hw = this.hw;
            var hh = this.hh;

            // debugger;
            // var rotRad = this.bodyDef.angle;
            // // var shape = body.GetShapeList(); // we only deal with single-shape bodies
            // var rot = rotRad * (180.0/Math.PI);
            var pos = this.body.GetPosition();
            var angle = this.body.GetAngle();
            var deg = angle * (180/Math.PI);
            // deg = deg<0?0:deg;
            // deg = deg>360?360:deg;
            // if(!this.bodyDef){return}
            this.style.transform = `translate3d(${(pos.x-(hw))*this.scale}px, ${(pos.y-(hh))*this.scale}px, 0px) rotate(${deg%360}deg)`;
            // this.style.width = (hw*2)* (this.scale)+"px";
            // this.style.height= (hh*2)* (this.scale)+"px";
        }
    }
)


                display.worlds.entities.html.PolygonShape.prototype.template = function(){
                    return `<template>
    <div>DIV</div>
</template>
`
                };

                display.worlds.entities.html.PolygonShape.prototype.cssStyle = function(){
                    return `.PolygonShape {
    background:#a5e002;
    /*display:none;*/
    transform-origin: center;
}
`
                };

                display.worlds.entities.html.PolygonShape.prototype.onLoadInstanceStylesheet = function(){ return false }
