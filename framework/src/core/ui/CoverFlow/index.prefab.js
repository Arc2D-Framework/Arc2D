(()=> {var html_template = `<template>
  <div class="container">
    <i id="move-left-btn"  class="fas fa fa-caret-left" ><</i>
    <i id="move-right-btn" class="fas fa fa-caret-right">></i>
   

    <div id="carousel" class="no-backface-visibility" style="width:75px;">
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p1.jpg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Caterina</div>
                </div>
            </div>
        </div>
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p2.jpeg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Lotte</div>
                </div>
            </div>
        </div>
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p6.jpg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Rick Grimes</div>
                </div>
            </div>
        </div>
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p5.jpg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Pirate</div>
                </div>
            </div>
        </div>
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p3.jpg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Fenna</div>
                </div>
            </div>
        </div>
        <div class="tile">
            <div class="item">
                <span class="photo" style="background-image:url(../../../src/core/ui/CoverFlow/images/p4.jpg);"></span>
                <div class="emp-info">
                    <div class="emp-name">Mr. Starks</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
`;var css_template = `.CoverFlow {
  display: block;
    height: 100px;
    margin: 30px auto;
    width: 300px;
  box-sizing: border-box;

}

.CoverFlow .hierarchy-icon {
    display: block;
    position: absolute;
    right: 20px;
    top: -30px;
}
.CoverFlow .container {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  position: relative;
  overflow: visible !important;
  box-sizing: border-box;
  -webkit-perspective: 400px;
  perspective: 400px;
}

.CoverFlow #carousel {
    display: block;
    height: 100%;
    margin: auto;
    overflow: visible !important;
    transform: rotateY(0deg);
    transform-style: preserve-3d;
    transition: transform 0.7s ease 0s;
    width: 75px;

  box-sizing: border-box;
  -webkit-transform-style: preserve-3d;
         -moz-transform-style: preserve-3d;
           -o-transform-style: preserve-3d;
              transform-style: preserve-3d;
}

.CoverFlow #carousel .tile {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  box-sizing: border-box;
  background: rgba(255,255,255,.9);
}

.CoverFlow #move-left-btn,
.CoverFlow #move-right-btn{
  cursor: pointer;
    height: 17px;
    margin-top: -35px;
    padding: 20px;
    position: absolute;
    top: 50%;
    width: 10px;
    color: black;
    font-size: 41px;
    z-index:1000;
}

.CoverFlow #move-right-btn{
  right: 30px;
}
.CoverFlow #move-left-btn{
  left: 30px;
}

.CoverFlow #carousel.no-backface-visibility .tile {
  -webkit-backface-visibility: visible;
         -moz-backface-visibility: visible;
           -o-backface-visibility: visible;
              backface-visibility: visible;
} 

.CoverFlow #carousel .tile .item {
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 100%;
}
.CoverFlow #carousel div .item .photo {
    display: block;
    height: 100%;
    margin: auto;
    position: absolute;
    width: 100%;
    background-size: cover;
    background-position: center;
  }

.CoverFlow #carousel div .item .emp-info {
    font-size: 10px;
    margin: 7px auto auto;
    z-index: 10;
    background: white;
    position: absolute;
    margin: 2px;
    bottom: 0;
    border-radius: 1px;
    right: 26px;
    left: 0;
    min-height: 26px;
    right: 0;
}

.CoverFlow #carousel div .item .emp-position {
    font-size: 8px;
}
`;

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

        onEnableShadow() {
            return false
        }
     }
);
})()