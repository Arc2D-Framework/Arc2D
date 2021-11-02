
                
namespace `ui.components` (
	class RippleButton extends WebComponent  {
		static get is(){
			return "ripple-button"
		}

		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), "false", "button");
		}

		onClick(e){
			const button = e.target;//event.currentTarget;

			const circle = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = circle.style.height = `${diameter}px`;
			circle.style.left = `${e.src.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${e.src.clientY - button.offsetTop - radius}px`;
			circle.classList.add("ripple");

			const ripple = button.querySelector(".ripple");
			ripple && ripple.remove();

			button.appendChild(circle);
		}
	}
)


                ui.components.RippleButton.prototype.template = function(){
                    return `<template>
	<button>Find out more</button>
</template>
`
                };

                ui.components.RippleButton.prototype.cssStyle = function(){
                    return `.RippleButton {
	
}

:host button {
    position: relative;
    overflow: hidden;
    transition: background 400ms;
    color: #fff;
    background-color: #176ab3;
    padding: 1rem 2rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1.5rem;
    outline: 0;
    border: 0;
    border-radius: 0.25rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3); /* black with 30% opacity */
    cursor: pointer;
  }
  
  :host span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
`
                };

                ui.components.RippleButton.prototype.onLoadInstanceStylesheet = function(){ return false }
