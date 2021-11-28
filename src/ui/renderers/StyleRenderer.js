namespace `ui.renderers` (
    class StyleRenderer {
        constructor(sprite){
            this.element = sprite;
            this.element.classList.add("style")
            this.options = sprite.options;
            // this.canvas = this.options.canvas||sprite.querySelector("canvas");
            // this.context = this.options.context||this.canvas.getContext("2d");
            this.tickCount = this.options.tickCount ||0;
            this.element.innerHTML="";
            // this.element.append('<div></div>');
            // this.element.image.removeAttribute("src");
            this.element.style.width = this.element.width + "px";
            this.element.style.height= this.element.height+ "px"
        }

        onUpdate(timestamp, delta){
            // if(!this.context){return}
            this.tickCount += delta;
            if (this.tickCount > this.element.ticksPerFrame) {
                this.tickCount = 0;
                if (this.element.frameIndex < this.element.frames - 1) {
                    this.element.frameIndex += 1;
                } else {
                    this.element.frameIndex = 0;
                }
            }
        }

        onDraw(){
           /* this.context.clearRect(0, 0, this.element.width, this.element.height);
            this.context.drawImage(
                this.element.image,
                this.element.frameIndex * this.element.width, // The x-axis coordinate of the top left corner
                this.element.row * this.element.height, // The y-axis coordinate of the top left corner
                this.element.width, // The width of the sub-rectangle
                this.element.height, // The height of the sub-rectangle
                this.element.x, // The x coordinate
                this.element.y,// The y coordinate
                this.element.width, // The width to draw the image
                this.element.height // The width to draw the image
            )*/
            this.element.style.backgroundPosition = `-${this.element.frameIndex * this.element.width}px -${this.element.row * this.element.height}px`
        }
    }
)