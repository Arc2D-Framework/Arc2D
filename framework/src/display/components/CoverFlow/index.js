import '/node_modules/od-core-extensions/String.js';

namespace `core.ui` ( 
    class CoverFlow extends w3c.ui.WebComponent {
        constructor(){
            super();
        }

        async onConnected(){
            // await this.render({});
            await super.onConnected();
            this.transform = "transform".toVendorPrefix();
            this.isHorizontal = true;
            this.faces = [].slice.call(this.querySelectorAll("#carousel .tile"));
            this.carousel = this.querySelector("#carousel");
            this.panelSize = 200;//this.carousel[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
            this.carousel.style.width=this.panelSize+"px";
            
            this.panelCount = this.faces.length;
            this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
            this.theta = 360 / this.faces.length;
            this.radius = Math.round( ( this.panelSize / 2 ) / Math.tan( ( ( Math.PI * 2 ) / this.faces.length ) / 2 ) );//Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) );
            this.rotation = 0;
            this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

            this.rotateFaces()

            this.btnLeft = this.querySelector("#move-left-btn");
            this.btnRight = this.querySelector("#move-right-btn");
            this.addEventListener("click", (e)=>this.onClick(e), false);

        }

        onClick (e){
            switch(e.target.id){
                case "move-left-btn":
                    this.onMove(-1);
                    break;
                case "move-right-btn":
                    this.onMove(1);
                    break;
            }
        }

        onMove(increment){
            this.rotation += this.theta * increment * -1;
            this.rotateCarousel();
        }

        rotateFaces(){
            var self=this;
            
            this.tz = this.radius;
            this.tz += 10;

            for(var i=0; i<=this.faces.length-1; i++){
                var face = this.faces[i];
                face.style[this.transform] = this.rotateFn + "(" + (i*this.theta) + "deg) translateZ(" + this.tz + "px)";           
            }
            
            this.rotateCarousel();
        }

        rotateCarousel (){
            this.carousel.style[this.transform] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
        }

        inShadow() {
            return false
        }
     }
);