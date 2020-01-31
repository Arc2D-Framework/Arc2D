namespace `docs.demos.ui` (
	class ToggleButton  extends w3c.ui.WebComponent  {
		onConnected(){
            super.onConnected();
            this.addEventListener("click", e => this.onClick(e));
            this.knob = this.querySelector("div");
            this.direction = -1;
            //REACT COMPARISON: https://codesandbox.io/s/wn479wmorl
            //https://www.youtube.com/watch?v=RENGNzZ0dIs
        }

        onStyleComputed(style){//wait for styles
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();
        }


        onClick(){
            this.direction *= -1;
            this.translate(this.knob, { x : this.getX() });
            this.direction;
        }

        getX(){
            return this.direction > 0 ?
                this.bounds.width-this.knob_bounds.width-6 : 0;
        }

        translate(el,v){
            el.style.transform = `translate3d(${v.x||0}px,${v.y||0}px,${v.z||0}px)`;
        }
	}
)