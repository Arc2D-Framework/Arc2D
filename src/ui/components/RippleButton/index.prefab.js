
                
import '/src/system/lang/Thread.js';

namespace `ui.components` (
	class RippleButton extends WebComponent  {
		static get is(){
			return "ripple-button"
		}

		async onConnected(){
			await super.onConnected();
			//alert("connecting")
			this.thread = new system.lang.Thread(this.onCalculate)
			this.thread.addEventListener("message", e => this.onCalculated(e))
			this.on("click", e=>this.onClick(e), true, "button");
		}

		onAwake(){
			//alert("onAwake")
		}

		onSleep(){
			//alert("onSleep")
		}

		//worker
		onCalculate(e){
			//worker does some calculation
			var num = e.data+100;
			postMessage({value:num});//returns it back to thread
		}

		onCalculated (e) {
			console.log("received:", e.data);//thread receives calculated result
		}

		isComposable(){return true}

		async onClick(e){
			// debugger;
			this.thread.postMessage(100);//send to worker
			const button = e.matchedTarget;

			const circle = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = circle.style.height = `${diameter}px`;
			circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
			circle.classList.add("ripple");

			const ripple = button.querySelector(".ripple");
			ripple && ripple.remove();

			this.append(circle,button);
		}



		async onDisconnected(){
			console.log("removed",this)
		}

	}
)


                ui.components.RippleButton.prototype.template = function(){
                    return `<template>
	<button>
		<slot name="label">Label</slot>
	</button>
</template>
`
                };

                ui.components.RippleButton.prototype.cssStyle = function(){
                    return `/* :host {min-width: 200px;} */
:host {display: inline-block;border:1px solid red}
:host button {
  width: 100%;
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
  
  :host span{transform: translateZ(0);}
  :host span.ripple {
    will-change: transform;
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 700ms linear;
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
