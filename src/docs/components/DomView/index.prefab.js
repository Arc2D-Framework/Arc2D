;(()=> {
                

namespace `docs.components` (
    class DomView extends w3c.ui.WebComponent {
        async onConnected() {
            await super.onConnected();
            this.lastMouseX=0;
            this.lastMouseY=0;
            this.rotX=0;
            this.rotY=0;

            this.addEventListener("mousedown", e=> this.onMouseDown(e));
            this.addEventListener("mouseup", e=> this.onMouseUp(e));
            this.addEventListener("mousemove", e=> this.onMouseMove(e));
        }


        onStyleComputed(style){//wait for styles
            var canvasBounds = this.getBoundingClientRect();
            wait(300).then(e => {
                var node = this.querySelector(".WebComponent");
                var rect = node.getBoundingClientRect();
                var node_half_w = (rect.width/2);
                var node_half_h = (rect.height/2);

                node.style.left = ((canvasBounds.width/2)-node_half_w) + "px";
                node.style.top = ((canvasBounds.height/2)-node_half_h) + "px"
            })
        }


        onMouseDown(e){
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.activeEl = this.querySelector(".WebComponent");//this.querySelector(".transformed", e);
            if(this.activeEl){
                // var style = window.getComputedStyle(this.activeEl);
                // var matrix = new DOMMatrix(style.transform);
                // this.matrix = matrix;
                // // console.log("matrix",matrix)
            }
        }

        onMouseUp(e){
            this.activeEl=null;
        }

        onMouseMove(e){
            if(!this.activeEl) { return };
            var deltaX = e.pageX - this.lastMouseX;
            var deltaY = e.pageY - this.lastMouseY;

            this.lastMouseX = e.pageX;
            this.lastMouseY = e.pageY;

            this.rotY -= deltaX * 0.5;
            this.rotX += deltaY * 0.5;
            // $("#mainWrapper").css("transform", "rotateY(" + rotY + "deg)" + " " + "rotateX(" + -rotX + "deg)");
            this.activeEl.style.transform = "rotateY(" + this.rotY + "deg)" + " " + "rotateX(" + -this.rotX + "deg)"

        }
    }
);



                docs.components.DomView.prototype.template = function(){
                    return `<template>
    <div id="canvas">
        <slot name="component">Hello</slot>
    </div>
</template>
`
                };

                docs.components.DomView.prototype.cssStyle = function(){
                    return `dom-view {
    width:100%;
    display:block;
    min-height:200px;
    position:relative;
    border:1px solid gray;
    background-size: 10px 10px;
    background-image:
        linear-gradient(to right, rgba(0,0,0,.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,.1) 1px, transparent 1px);
}

dom-view #canvas {
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

    background-image: url(src/docs/components/DomView/axis_icon.png);
    background-size: 42px;
    background-repeat: no-repeat;
    background-position: right top;
}


dom-view #canvas slot {
    display: block;
    height: 100%;
}

dom-view #canvas slot > .WebComponent {
    position: absolute;
}



dom-view slot *{
  background-color: rgba(0, 0, 0, 0.22) !important;
  transform: translateZ(30px) scale(0.940);
  border:1px solid red;
  transform-style: preserve-3d;
  box-shadow: 6px 6px 3px -3px rgba(0,0,0,.5);
}
`
                };

                docs.components.DomView.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();
