import '/src/applications/FpsTest/sprites/circle.js';
import '/src/applications/FpsTest/sprites/Planet.js';

namespace `applications` (
    @stylesheets(["src/./index.css"]);
    class FpsTest extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            // super.onConnected();
            await this.render()

            this.canvas = document.getElementById('canvas');
		    this.context = this.canvas.getContext('2d');

		    this.fpsCounter = document.getElementById('fpscounter');
		    this.fpsValue = document.getElementById('fpsvalue');
		    this.fps = document.getElementById('fps');

		    // Update the slider value label while the slider is being dragged.
			this.fps.addEventListener('input', e=> {
			    this.fpsValue.textContent = Math.round(e.target.value);
			});
			
			// Throttle the FPS when the slider value is set.
			this.fps.addEventListener('change', function() {
			    var val = parseInt(this.value, 10);
			    MainLoop.setMaxAllowedFPS(val === 60 ? Infinity : val);
			});


			this.canvas.width  = window.innerWidth;
			this.canvas.height = window.innerHeight;

			// Set up some planets.
			var smallerDimension = Math.min(window.innerWidth, window.innerHeight),
			    earthOrbitRadius = smallerDimension * 0.38,
			    moonOrbitRadius = smallerDimension * 0.10,
			    moonRadius = smallerDimension * 0.01,
			    moon2Radius = smallerDimension * 0.04,
			    sunRadius = earthOrbitRadius * 0.5,
			    earthRadius = earthOrbitRadius * 0.15,
			    sun = new Planet({x: this.canvas.width*0.5, y: this.canvas.height * 0.5}, sunRadius, 0, 0, '#FFD000'),
			    earth = new Planet(sun, earthRadius, earthOrbitRadius, 0.03 * Math.PI / 180, 'blue'),
			    moon = new Planet(earth, moonRadius, moonOrbitRadius, 0.1 * Math.PI / 180, 'gray'),
			    moon2 = new Planet(moon, moon2Radius, moonOrbitRadius, 0.1 * Math.PI / 180, 'gray');

			window.sprites.push(sun);
			window.sprites.push(earth);
			window.sprites.push(moon);
			// window.sprites.push(moon2);

        }


		onEnd(fps, panic){
			super.onEnd(fps, panic);
			if(this.fpsCounter){this.fpsCounter.textContent = Math.round(fps) + ' FPS';}
		}
    }
);
