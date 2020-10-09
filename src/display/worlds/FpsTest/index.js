import! 'display.worlds.entities.canvas.Planet';

namespace `display.worlds` (
    class FpsTest extends World {
        constructor(element){
            super(element);
            window.sprites = [];
        }

        async onConnected() {
            await super.onConnected();

            this.canvas = this.querySelector('#canvas');
		    this.context = this.canvas.getContext('2d');

		    this.fpsCounter = this.querySelector('#fpscounter');
		    this.fpsValue = this.querySelector('#fpsvalue');
		    this.fps = this.querySelector('#fps');

		    // Update the slider value label while the slider is being dragged.
			this.fps.addEventListener('input',  this.onShowFPS);
            this.fps.addEventListener('change', this.onUpdateFPS);


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
			    sun = new display.worlds.entities.canvas.Planet({x: this.canvas.width*0.5, y: this.canvas.height * 0.5}, sunRadius, 0, 0, '#FFD000'),
			    earth = new display.worlds.entities.canvas.Planet(sun, earthRadius, earthOrbitRadius, 0.03 * Math.PI / 180, 'blue'),
			    moon = new display.worlds.entities.canvas.Planet(earth, moonRadius, moonOrbitRadius, 0.1 * Math.PI / 180, 'gray'),
			    moon2 = new display.worlds.entities.canvas.Planet(moon, moon2Radius, moonOrbitRadius, 0.3 * Math.PI / 180, 'gray');

			window.sprites.push(sun);
			window.sprites.push(earth);
			window.sprites.push(moon);
			window.sprites.push(moon2);

        }

        onFixedUpdate = (time) =>{
            // console.log("fixed",time)
            window.sprites.forEach(sprite => sprite.onFixedUpdate(time))
        }

        onDraw = (interpolation) => {
            // console.log("interpolation",interpolation)
            if(this.context){
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            window.sprites.forEach(sprite => sprite.onDraw(interpolation,this.context))
        }


        onUpdate = (timestamp, delta) => {
            // console.log("delta",delta)
            // console.log("timestamp",timestamp)
        }

        onShowFPS = (e) => {
            this.fpsValue.textContent = Math.round(e.target.value);
        }

        onUpdateFPS = (e) => {
            var val = parseInt(e.target.value, 10);
            MainLoop.setMaxAllowedFPS(val === 60 ? Infinity : val);
        }

		onUpdateEnd = (fps, panic) => {
			super.onUpdateEnd(fps, panic);
			if(this.fpsCounter){
                this.fpsCounter.textContent = Math.round(fps) + ' FPS';
            }
		}
    }
);
