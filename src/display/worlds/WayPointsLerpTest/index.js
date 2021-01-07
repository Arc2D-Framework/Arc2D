
import 'system.input';
import 'system.math';
import 'system.machines';

namespace `display.worlds` (
    class WayPointsLerpTest extends World {
        async onConnected() {
            await super.onConnected();
            this.coords = new Vector(0,0);
            this.box = this.querySelector("#box")
            this.wayPoints = [
               new Vector(500,0),
               new Vector(100,100),
               new Vector(1000,400),
               new Vector(100,100),
               new Vector(99,77),
               new Vector(0,0),
               new Vector(0,500),
               new Vector(500,500),
               new Vector(0,99),
               new Vector(0,0),
               new Vector(1000,1000),
               new Vector(500,0),
               new Vector(100,100),
               new Vector(1000,400),
               new Vector(100,100),
               new Vector(99,77),
               new Vector(0,0)
            ];
            this.velocity=.7;
            this.currentWP = 0;
            this.wayptNav = new WaypointNavigator(this);
            
            this.setupFpsSlider()
        }

        setupFpsSlider(){
            this.fpsCounter = this.querySelector('#fpscounter');
		    this.fpsValue = this.querySelector('#fpsvalue');
		    this.fps = this.querySelector('#fps');

		    // Update the slider value label while the slider is being dragged.
			this.fps.addEventListener('input',  this.onShowFPS);
            this.fps.addEventListener('change', this.onUpdateFPS);
        }

        getSimulationTimestep(){ return 1000 / 120 }

        onFixedUpdate = async (time) =>{
            if(!this.box.ismoving){;return}
            this.wayptNav.onFixedUpdate(time)
        }

        onUpdate=(accumilated, delta)=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this.starttime = Date.now();
                    // this.currentWP=0;
                    this.box.ismoving=true;
                }
            }
        }

        onDraw = (i) => {
            var x = Math.round(this.coords.x);
            var y = Math.round(this.coords.y);
            this.box.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
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