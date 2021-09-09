
namespace `ui.components` (
	class Knob2 extends WebComponent  {
		

		async onConnected(){
			await super.onConnected();
			this.knob 		= this.querySelector('.knob');
			this.ticks 		= Array.from(this.querySelectorAll('.tick'));
			this.angle 		= 0;
			this.minangle 	= 0;
			this.maxangle 	= 270;

			//mouse events
			this.addEventListener("mousedown", e => this.onPress(e), true);
			document.addEventListener("mousemove", e => this.onRotate(e), true);
			document.addEventListener("mouseup", e => this.onRelease(e), true);
			
			//mouse wheel
			this.addEventListener("DOMMouseScroll", e => this.onScroll(e.wheelDelta > 0), true);
			this.addEventListener("mousewheel", e => this.onScroll(e.wheelDelta > 0), {passive:true});
		}

		onPress(){
			this.center = this.getBoundingClientRect().center
			this.isPressed=true;
		}

		onRelease(){
			this.isPressed=false;
		}

		onScroll(bool) {
			this.angle = (bool && this.angle + 2 <= this.maxangle) 
				? this.angle + 2 : (!bool && this.angle - 2 >= this.minangle) 
				? this.angle - 2 : this.angle;
			this.highlightTicks(true);
		}

		onRotate(mouse){
			if(this.isPressed){
				this.radians = Math.atan2(this.center.x - mouse.x, this.center.y - mouse.y);
				this.degrees = this.radians * 180 / Math.PI; //convert radians to degrees
				this.angle = -(this.degrees - 135);

				if(this.angle >= this.minangle && this.angle <= this.maxangle){
					this.volumeSetting = Math.floor(this.angle / (this.maxangle / 100));
					this.highlightTicks(true);
					// this.tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10); //interpolate how many ticks need to be highlighted
				}
			}
        }

		
		highlightTicks(rotate=false) {
			rotate && (
				this.knob.style.transform = `rotate(${this.angle}deg)`
			)
			
			var activeTicks = (Math.round(this.angle / 10) + 1);
				this.ticks.forEach(tick => tick.classList.remove('activetick'))
				this.ticks.slice(0,activeTicks).forEach(t => t.classList.add('activetick'))
			
			// update % value in text
			// var pc = Math.round((this.angle/270)*100);
			// console.log("percent", pc)
			// $('.current-value').text(pc+'%');
		}
	}
)