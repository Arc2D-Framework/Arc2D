import '/src/core/ui/game/animations/Animation.js';

namespace `core.ui.game.animations` (
    class Shoryuken extends core.ui.game.animations.Animation {
        constructor(name, sprite){
        	super(name, sprite);
			this.sprite = sprite;
			this.name   = name;
		}

		start() {
			if(this.isAnimating && this.sprite.fire){return}
			this.sprite.y_velocity -= 2;
            this.sprite.fire = true;
            this.sprite.classList.add(this.name);
            wait(500).then(_=> this.isAnimating=true);
            wait(1000).then(_=> this.sprite.classList.remove(this.name));
		}

		stop() {
			this.sprite.classList.remove(this.name);
			this.isAnimating=false;
			this.sprite.fire = false;
			this.sprite.y = 0;
			this.sprite.y_velocity = 0;
		}

		update(){
			if(!this.isAnimating){return}
                // this.sprite.isjumping=true;
			// this.isAnimating=true;
			// this.isAnimating=true;
				// alert("animating")
			this.sprite.y_velocity += 2.5;// gravity
            this.sprite.y += this.sprite.y_velocity;
            this.sprite.y_velocity *= 1;// friction
            // console.log("y",this.sprite.y,this.sprite.y<=-500)
            if(this.sprite.y<=-500){this.sprite.y = 500*-1; this.sprite.y_velocity += 4}
            // if(this.sprite.y >= 500){this.sprite.y=500}
            if (this.sprite.y > window.innerHeight - 900) {
                this.sprite.fire = false; 
                this.sprite.y = window.innerHeight-900;
                this.sprite.y_velocity = 0;
                // this.isAnimating=false;
                if(this.sprite.y <=0){
                	this.stop();
                }
            }
            // if(this.sprite.y >= 500){this.sprite.y=500}
            this.sprite.style.transform = "translate3d(" + this.sprite.x + "px," + this.sprite.y + "px,0px) scale(3)";
		}
    }
);
