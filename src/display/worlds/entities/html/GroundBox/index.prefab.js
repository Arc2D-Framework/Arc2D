
                
namespace `display.worlds.entities.html` (
	class GroundBox extends display.worlds.entities.html.Box2DEntity {
        constructor(hWidth,hHeight,world,stage,scale,element){
            super(element);
            this.hw     =hWidth;
            this.hh     =hHeight;
            this.world  =world;
            this.scale  =scale;
            this.stage  =stage;
        }

        onLoadInstanceStylesheet(){return false}

        cssStyle(){
            return super.cssStyle() + `
                .GroundBox {
                    background:#1ac6ff;
                    /*display:none;*/
                }
            `
        }
		async onConnected(){
            await super.onConnected();
            // await this.render();
            var hw = this.hw;
            var hh = this.hh;

            var fixDef = new b2FixtureDef;
                fixDef.density = 1.0;
                fixDef.friction = 0.5;
                fixDef.restitution = 0.2;
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(hw, hh);

             var bodyDef = new b2BodyDef;
                 bodyDef.type = b2Body.b2_staticBody;
                 bodyDef.position.x = 10;
                 bodyDef.position.y = 11;
             
             this.world
                .CreateBody(bodyDef)
                .CreateFixture(fixDef);

             this.style.transform = `translate3d(${(bodyDef.position.x-(hw))*this.scale}px, ${(bodyDef.position.y-(hh))*this.scale}px, 0px)`;
             this.style.width = (hw*2)* (this.scale)+"px";
             this.style.height= (hh*2)* (this.scale)+"px";
        }
	}
)


                display.worlds.entities.html.GroundBox.prototype.template = function(){
                    return `<template>
	<div>DIV</div>
</template>
`
                };

                display.worlds.entities.html.GroundBox.prototype.cssStyle = function(){
                    return `.GroundBox {
	background:#1ac6ff;
    /*display:none;*/
}
`
                };

                display.worlds.entities.html.GroundBox.prototype.onLoadInstanceStylesheet = function(){ return false }
