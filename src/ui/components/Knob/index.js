


namespace `ui.components` (
	
	@theme("metal");
	class Knob extends WebComponent  {
		async onConnected(){
			await super.onConnected();
			this.knob 		= this.querySelector('.knob');
			this.ticks 		= Array.from(this.querySelectorAll('.tick'));
			this.angle 		= 0;
			this.minangle 	= 0;
			this.maxangle 	= 270;
			this.startangle = -135;
			this.spacing	= 10;
			this.draw();

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
			this.onHighlight(true);
		}

		onRotate(mouse){
			if(this.isPressed){
				this.radians = Math.atan2(this.center.x - mouse.x, this.center.y - mouse.y);
				this.degrees = this.radians * 180 / Math.PI; //convert radians to degrees
				this.angle = -(this.degrees - 135);

				if(this.angle >= this.minangle && this.angle <= this.maxangle){
					this.volumeSetting = Math.floor(this.angle / (this.maxangle / 100));
					this.onHighlight(true);
				}
			}
        }

		onHighlight(rotate=false) {
			rotate && (
				this.knob.style.transform = `rotate(${this.angle}deg)`
			);
			var activeTicks = (Math.round(this.angle / this.spacing) + 1);
				this.ticks.forEach(tick => tick.classList.remove('activetick'))
				this.ticks.slice(0,activeTicks).forEach(t => t.classList.add('activetick'))
			
			var percent = Math.ceil((this.angle/this.maxangle)*100);
			console.log("percent", percent)
		}

		draw(count) {
			/*let ticks = this.querySelector(".ticks")
			for(var i=0; i<count; i++) {
				ticks.append(
					`<div class='tick' style='transform:rotate(${this.startangle}deg)'></div>`.toNode()
				);
				this.startangle += this.spacing;
			}
		  	this.ticks 		= Array.from(this.querySelectorAll('.tick'));
          	this.startangle = -135; //reset*/

			let ticks = this.querySelector(".ticks")
			while(this.startangle <= Math.abs(this.maxangle-this.startangle)){

				ticks.append(
					`<div class='tick' style='transform:rotate(${this.startangle}deg)'></div>`.toNode()
				);
				this.startangle += this.spacing;
			}
			this.ticks 		= Array.from(this.querySelectorAll('.tick'));
          	this.startangle = -135;
      	}
	}
)