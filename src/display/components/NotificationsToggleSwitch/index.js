namespace `display.components` (
	class NotificationsToggleSwitch  extends WebComponent  {
		async onConnected(){
            await super.onConnected();

            debugger;
            this.knob = this.querySelector(".knob");
            this.direction = -1;
            this.addEventListener("click", e => this.onHandleToggleClick(e), false, "notifications-toggle-switch");
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
            this.nameSlot = this.querySelector("span#nameSlot");

            this.setSlotText();
            this.onReset = this.onHandleToggleClick;
        }

        setSlotText(){
            this.nameSlot.innerHTML = this.name || this.getAttribute("name");
        }

        async onStyleComputed(style){
            await wait(100);
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();
            var style = window.getComputedStyle(this.knob);
            var matrix = new DOMMatrix(style.transform);
            this.matrix = matrix;
        }

        onHandleToggleClick(){
            this.direction == 1 ? this.direction = 0 : this.direction = 1;
            this.onRender();
        }

        toggleActive(){
            this.classList.toggle("active");
            this.nameSlot.classList.toggle("active-color");
            this.dispatchEvent("toggleit",{toggleState:this.classList.contains("active")})
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