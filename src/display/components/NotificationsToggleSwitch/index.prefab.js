
                
namespace `core.ui` (
	class NotificationsToggleSwitch  extends w3c.ui.WebComponent  {
		async onConnected(){
            await super.onConnected();
            
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

        onStyleComputed(style){
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


                core.ui.NotificationsToggleSwitch.prototype.template = function(){
                    return `<template>
    <div class="knob"></div>
    <span id="nameSlot"></span>
</template>
`
                };

                core.ui.NotificationsToggleSwitch.prototype.cssStyle = function(){
                    return `
notifications-toggle-switch {
    width: 40px;
    height: 20px;
    display: block;
    background: lightgray;
    border-radius: 30px;
    box-sizing: content-box;
    padding: 3px;
    perspective: 3000px;
    transition: all .3s ease-out;
    transition-delay: .2s;
    position: relative;
    cursor: pointer;
}

notifications-toggle-switch .knob {
    transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    width: 20px;
    height: 20px;
    background: white;
    box-sizing: border-box;
    border-radius: 50%;
    cursor: pointer;
}

notifications-toggle-switch span{
    font-family: 'Inter', sans-serif;
    font-size: 22px;
    transition: all .2s ease-out;
    color: #828181;
    position: absolute;
    top: -3px;
    left: 60px;
    user-select: none;
}

.active{
    background: #55b982 !important;
}

.active-color{
    color: #333 !important;
}
`
                };

                core.ui.NotificationsToggleSwitch.prototype.onLoadInstanceStylesheet = function(){ return false }
