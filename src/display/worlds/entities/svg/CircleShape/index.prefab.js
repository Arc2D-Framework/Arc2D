
                
namespace `display.worlds.entities.svg` (
    class CircleShape extends WebComponent {
        constructor(radius,world,stage,scale,element){
            super(element);
            this.radius =radius;
            this.world  =world;
            this.scale  =scale;
            this.stage  =stage;

            var fixDef = new b2FixtureDef;
                fixDef.density = 7.0;
                fixDef.friction = 0.5;
                fixDef.restitution = 0.7;
             
            var bodyDef = this.bodyDef = new b2BodyDef;
                bodyDef.type = b2Body.b2_dynamicBody;
                bodyDef.position.x = Math.random() * 3;
                bodyDef.position.y = Math.random() * 3; 
             fixDef.shape = new b2CircleShape(this.radius);
             this.body = this.world.CreateBody(bodyDef);
             this.body.CreateFixture(fixDef);
             
             var svgNS = "http://www.w3.org/2000/svg";  
             this.element = document.createElementNS(svgNS,"circle"); //to create a circle.
             this.element.setAttributeNS(null,"fill",this.randomColor());
             this.element.setAttributeNS(null,"stroke","none");
             this.element.setAttributeNS(null,"r",this.radius*this.scale);

            // var svgNS = "http://www.w3.org/2000/svg";  
            // this.element = document.createElementNS(svgNS,"circle"); //to create a circle.
        }

        randomColor() {
            var chars = '0123456789ABCDEF'.split('');
          var color = '#';
          for (var i = 0; i < 6; i++)
            color += chars[Math.floor(Math.random() * 16)];
          return color;
        }

        onLoadInstanceStylesheet(){return true}

        async onConnected(){
            // await super.onConnected();
            //await this.render()
            // var fixDef = new b2FixtureDef;
            //     fixDef.density = 3.0;
            //     fixDef.friction = 0.2;
            //     fixDef.restitution = 0.2;
             
            // var bodyDef = this.bodyDef = new b2BodyDef;
            //     bodyDef.type = b2Body.b2_dynamicBody;
            //     bodyDef.position.x = Math.random() * 3;
            //     bodyDef.position.y = Math.random() * 3; 
            //  fixDef.shape = new b2CircleShape(this.radius);
            //  this.body = this.world.CreateBody(bodyDef);
            //  this.body.CreateFixture(fixDef);
             
            //  var svgNS = "http://www.w3.org/2000/svg";  
            //  this.element = document.createElementNS(svgNS,"circle"); //to create a circle.
            //  this.element.setAttributeNS(null,"fill","black");
            //  this.element.setAttributeNS(null,"stroke","none");
        }

        cssStyle(){}

        destroy(){
            this.world.DestroyBody(this.body);
            this.remove()
            // this.bodyDef=null;
            // this.body=null;
        }

        onDraw(){
            if(!this.body){return}
            // if(this.body.IsSleeping()){return}
            // var hw = this.hw;
            // var hh = this.hh;

            // debugger;
            // var rotRad = this.bodyDef.angle;
            // // var shape = body.GetShapeList(); // we only deal with single-shape bodies
            // var rot = rotRad * (180.0/Math.PI);
            var pos = this.body.GetPosition();
            var angle = this.body.GetAngle();
            var deg = angle * (180/Math.PI);

            // this.element.setAttributeNS(null,"cx",pos.x*this.scale);
            // this.element.setAttributeNS(null,"cy",pos.y*this.scale);
            // this.element.setAttributeNS(null,"r",this.radius*this.scale);
            // deg = deg<0?0:deg;
            // deg = deg>360?360:deg;
            // if(!this.bodyDef){return}
            this.element.style.transform = `translate3d(${(pos.x)*this.scale}px, ${(pos.y)*this.scale}px, 0px) rotate(${deg%360}deg)`;
            // this.style.width = (hw*2)* (this.scale)+"px";
            // this.style.height= (hh*2)* (this.scale)+"px";
        }
    }
)


                display.worlds.entities.svg.CircleShape.prototype.template = function(){
                    return `<template>
    
</template>
`
                };

                display.worlds.entities.svg.CircleShape.prototype.cssStyle = function(){
                    return `.CircleShape {
    background:#a5e002;
    /*display:none;*/
    transform-origin: center;
}
`
                };

                display.worlds.entities.svg.CircleShape.prototype.onLoadInstanceStylesheet = function(){ return false }
