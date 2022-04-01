
                

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


                ui.components.ParticleButton.prototype.template = function(){
                    return `<template>
	<button>Yay!</button>
</template>
`
                };

                ui.components.ParticleButton.prototype.cssStyle = function(){
                    return super.cssStyle() + `particle {
  position: fixed;
  left: 0;
  top: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
}

:host {
  padding: 10px;
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
`
                };

                ui.components.ParticleButton.prototype.onLoadInstanceStylesheet = function(){ return false }
