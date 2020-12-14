
                
namespace `display.components` (
	class ToggleButton extends WebComponent  {
        constructor(el){
            super(el);
            this.value = -1;
        }
		async onConnected(){
            await super.onConnected();

            this.knob = this.querySelector(".knob");
            this.addEventListener("click", e => this.onClick(e), false);
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
        }

        async onStyleComputed(style){
            await wait(100);
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();

            var style = window.getComputedStyle(this.knob);
            this.matrix = new DOMMatrix(style.transform);
        }

        onClick(){
            this.value *= -1;
            this.dispatchEvent("change");
            this.onRender();
        }

        get x() {
            return this.value > 0 ?
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


                display.components.ToggleButton.prototype.template = function(){
                    return `<template>    
    <span style="
    left: -55px;
    position: absolute;
    top: 5px;
    display: block;
">Core</span><div class="knob"></div>
<span style="
    /* left: -55px; */
    position: absolute;
    display: block;
    top: 5px;
    left: 100%;
    white-space: nowrap;
    margin-left: 18px;
">SDK (all)</span>
</template>
`
                };

                display.components.ToggleButton.prototype.cssStyle = function(){
                    return `
:host {
    width: 70px;
    height: 30px;
    display: block;
    background: lightgray;
    border-radius: 30px;
    box-sizing: content-box;
    padding: 3px;
    perspective: 3000px;
    box-sizing: unset !important;
}

:host .knob {
    transition: all .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    width: 30px;
    background: white;
    box-sizing: border-box;
    height: 100%;
    border-radius: 50%;
}

`
                };

                display.components.ToggleButton.prototype.onLoadInstanceStylesheet = function(){ return false }
