namespace `core.ui` (
	class NotificationsToggleSwitch  extends w3c.ui.WebComponent  {
		async onConnected(){
            await super.onConnected();

            this.knob = this.querySelector(".knob");
            this.direction = -1;
            this.addEventListener("click", e => this.onClick(e), false);
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
            this.nameSlot = this.querySelector("span#nameSlot");
            this.element = this;

            this.setSlotText();
        }

        onfireEvt(){
            this.dispatchEvent("toggleclick",{bubbles:true,cancelable: true,toggleState:true});
        }

        setSlotText(){
            this.nameSlot.innerHTML = this.name || this.getAttribute("name");
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
            this.onfireEvt();
        }

        toggleActive(){
            this.classList.toggle("active");
            this.nameSlot.classList.toggle("active-color");
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
            this.toggleActive();
        }
	}
)