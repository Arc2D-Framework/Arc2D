namespace `applications.box2d.entities.html` (
	class GroundBox extends applications.box2d.entities.html.Box2DEntity {
        constructor(hWidth,hHeight,world,stage,scale,element){
            super(element);
            this.hw     =hWidth;
            this.hh     =hHeight;
            this.world  =world;
            this.scale  =scale;
            this.stage  =stage;
        }

        onLoadInstanceStylesheet(){return true}

		async onConnected(){
            // await super.onConnected();
            await this.render();
            var fixDef = new b2FixtureDef;
                fixDef.density = 1.0;
                fixDef.friction = 0.5;
                fixDef.restitution = 0.2;
             
             var bodyDef = new b2BodyDef;
                 bodyDef.type = b2Body.b2_staticBody;
                 bodyDef.position.x = 10;
                 bodyDef.position.y = 11;
             fixDef.shape = new b2PolygonShape;
             var hw = this.hw;
             var hh = this.hh;
             fixDef.shape.SetAsBox(hw, hh);
             this.world.CreateBody(bodyDef).CreateFixture(fixDef);

             // debugger;
             this.style.transform = `translate3d(${(bodyDef.position.x-(hw))*this.scale}px, ${(bodyDef.position.y-(hh))*this.scale}px, 0px)`;
             this.style.width = (hw*2)* (this.scale)+"px";
             this.style.height= (hh*2)* (this.scale)+"px";
        }
	}
)