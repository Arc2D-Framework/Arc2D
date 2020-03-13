namespace `docs.demos.ui` (
	class ToggleButton  extends w3c.ui.WebComponent  {
		async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onClick(e), false, ".knob");
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
            this.knob = this.querySelector("div");
            this.direction = -1;
        }

        onStyleComputed(style){
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();

            var style = window.getComputedStyle(this.knob);
            var matrix = new DOMMatrix(style.transform);
            this.matrix = matrix;
        }

        onClick(){
            this.direction *= -1;
            this.onRender();
        }

        get x() {
            return this.direction > 0 ?
                this.bounds.width-this.knob_bounds.width-6 : 0;
        }

        onRender(){
            var vector = {x: this.x, y:0, z:0 }
            this.knob.style.transform = `
                translate3d(${vector.x||0}px,${vector.y||0}px,${vector.z||this.matrix.m43}px)
            `;
        }
	}
)