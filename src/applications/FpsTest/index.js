import '/src/applications/FpsTest/misc/circle.js';
import! 'core.ui.Planet';

namespace `applications` (
    class FpsTest extends World {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();

            this.canvas = this.querySelector('#canvas');
		    this.context = this.canvas.getContext('2d');

		    this.fpsCounter = this.querySelector('#fpscounter');
		    this.fpsValue = this.querySelector('#fpsvalue');
		    this.fps = this.querySelector('#fps');

		    // Update the slider value label while the slider is being dragged.
			this.fps.addEventListener('input',  e => this.onShowFPS(e));
            this.fps.addEventListener('change', e => this.onUpdateFPS(e));


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
			    sun = new core.ui.Planet({x: this.canvas.width*0.5, y: this.canvas.height * 0.5}, sunRadius, 0, 0, '#FFD000'),
			    earth = new core.ui.Planet(sun, earthRadius, earthOrbitRadius, 0.03 * Math.PI / 180, 'blue'),
			    moon = new core.ui.Planet(earth, moonRadius, moonOrbitRadius, 0.1 * Math.PI / 180, 'gray'),
			    moon2 = new core.ui.Planet(moon, moon2Radius, moonOrbitRadius, 0.3 * Math.PI / 180, 'gray');

			window.sprites.push(sun);
			window.sprites.push(earth);
			window.sprites.push(moon);
			window.sprites.push(moon2);

        }

        onShowFPS(e){
            this.fpsValue.textContent = Math.round(e.target.value);
        }

        onUpdateFPS(e){
            var val = parseInt(e.target.value, 10);
            MainLoop.setMaxAllowedFPS(val === 60 ? Infinity : val);
        }

		onEnd(fps, panic){
			super.onEnd(fps, panic);
			if(this.fpsCounter){this.fpsCounter.textContent = Math.round(fps) + ' FPS';}
		}
    }
);
