namespace `ui.renderers` (
    class StyleRenderer {
        constructor(sprite){
            this.element = sprite;
            this.element.classList.add("style")
            this.options = sprite.options;
            this.tickCount = this.options.tickCount || 0;
            this.element.innerHTML="";
            this.element.style.width  = this.element.width + "px";
            this.element.style.height = this.element.height + "px";
            this.frameIndex=0;
        }

        onUpdate(timestamp, delta) {
            this.tickCount += delta;
            var ani = this.element.animation;
            this.currentFrame = ani.frames[ani.frameIndex]||ani.frames[0];

            if (this.tickCount > this.currentFrame.ticks) {
                this.tickCount = 0;
                if (ani.frameIndex < ani.frames.length - 1) {
                    ani.frameIndex += 1;
                } else {
                    ani.frameIndex = 0;
                }
            }
            
            /*if (this.tickCount > this.element.ticksPerFrame) {
                this.tickCount = 0;
                if (this.element.frameIndex < this.element.frames - 1) {
                    this.element.frameIndex += 1;
                } else {
                    this.element.frameIndex = 0;
                }
            }*/
        }

        onDraw() {
            // this.element.style.width = `${this.currentFrame.width}px`
            // this.element.style.height = `${this.currentFrame.height}px`

            this.element.style.backgroundPosition = `
                -${this.currentFrame.x}px -${this.currentFrame.y}px
            `
            // this.element.style.transform = `
            //     translate3d(${this.element.x}px, ${this.element.y}px, 0px) 
            //     scaleX(${this.element.direction})
            // `;
        }

        // onDraw() {
        //     this.element.style.backgroundPosition = `
        //         -${this.element.frameIndex * this.element.width}px -${this.element.row * this.element.height}px
        //     `
        //     this.element.style.transform = `
        //         translate3d(${this.element.x}px, ${this.element.y}px, 0px) 
        //         scaleX(${this.element.direction})
        //     `;
        // }
    }
)