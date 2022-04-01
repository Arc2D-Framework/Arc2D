(async (global)=>{ namespace `ui.components` (
	class MenuToggleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, ".nav-icon");
		}

		onClick(e){
			e.target.classList.toggle("active")
		}
	}
)



                
namespace `system.lang` (
    class Thread {
        constructor(func){
            this.func = func;
            var blob;
            if(this.func.name == "") {
                blob = new Blob([`self.onmessage = ${this.func.toString()}`]);
            }
            else {
                var src = this.func.toString();
                src = src.replace(this.func.name, "function")
                blob = new Blob([`self.onmessage = ${src}`]);
            }
            var blobURL = window.URL.createObjectURL(blob);
            var worker = new Worker(blobURL);
            return worker;
        }
    }
)



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




namespace `ui.components` (
	class ParticleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, "button");
		}

		onClick(e){
			e=e.src;//original event;
			for (let i = 0; i < 30; i++) {
				this.addParticleAt(e.clientX, e.clientY);
			}
		}

		addParticleAt (x, y) {
			const particle = document.createElement('particle');
			// Calculate a random size from 5px to 25px
			const size = Math.floor(Math.random() * 20 + 5);
			particle.style.width = `${size}px`;
			particle.style.height = `${size}px`;

			// Generate a random blue/purple palette
			particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;
			
			// Generate a random x & y destination within a distance of 75px from the mouse
			const destinationX = x + (Math.random() - 0.5) * 2 * 75;
			const destinationY = y + (Math.random() - 0.5) * 2 * 75;
			document.body.appendChild(particle);
			
			// Store the animation in a variable as we will need it later
			const animation = particle.animate([
			  {
				// Set the origin position of the particle
				// We offset the particle with half its size to center it around the mouse
				transform: `translate3d(-50%, -50%, 0) translate3d(${x}px, ${y}px, 0px)`,
				opacity: 1
			  },
			  {
				// We define the final coordinates as the second keyframe
				transform: `translate3d(${destinationX}px, ${destinationY}px, 0px)`,
				opacity: 0
			  }
			], 
			{//animate options
			  duration: Math.random() * 1000 + 500,
			  easing: 'cubic-bezier(0, .9, .57, 1)',
			  delay: Math.random() * 200
			});
			
			animation.onfinish = () => particle.remove();
		}
	}
)


namespace `ui.components` (
	class SideBar  extends w3c.ui.WebComponent  {
		
	}
)



namespace `ui.components` (
	class Accordion extends WebComponent  {
		
	}
)


tag(ui.components.Accordion, 'accordion-list');

namespace `ui.components.accordions` (
	class BasicAccordion extends WebComponent  {
		
	}
)



namespace `ui.components` (
 class Label extends WebComponent {
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
        }

        onClick(){
            this.classList.toggle("active")
        }
        // isComposable(){
        //     return true
        // }

        // onLoadInstanceStylesheet(){
        //     return false
        // }

        // inShadow(){
        //     return false
        // }

        // cssStyle(){return `
        //     :host span{
        //         color:red;
        //     }
        //     :host(.active) {
        //         border:3px solid red;
        //     }
        // `}

        // template(){
        //     return `
        //         <template>
        //             <i><slot name="label">[label here]</slot></i>
        //         </template>
        //     `
        // }
    }
)
 





namespace `ui.screens` (
    class ComponentsDemo extends Application {
        async onConnected(){
            await super.onConnected()
            var c = new ui.components.RippleButton();
                c.assignSlot(`<span slot="label">Hello There</span>`.toNode());
            await this.append(c);
        }
    }
);


 })(this)