
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
