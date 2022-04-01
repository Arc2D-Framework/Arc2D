namespace `ui.renderers` (
    class StyleRenderer {
        constructor(sprite){
            this.element = sprite;
            this.element.classList.add("style")
            this.options = sprite.options;
            this.tickCount = this.options.tickCount || 0;
            this.element.innerHTML="";
            this.element.style.width  = this.element.width + "px";
            this.element.style.height = this.element.height + "px"
        }

        onUpdate(timestamp, delta) {
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

        onDraw() {
            this.element.style.backgroundPosition = `
                -${this.element.frameIndex * this.element.width}px -${this.element.row * this.element.height}px
            `
        }
    }
)