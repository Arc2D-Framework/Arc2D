import '/src/core/ui/game/animations/Animation.js';

namespace `core.ui.game.animations` (
    class Hadoken extends core.ui.game.animations.Animation {
        constructor(name, sprite){
        	super(name, sprite);
			this.sprite = sprite;
			this.name   = name;
			// this.sprite.velocity = 5;
			// this.sprite.x = 0;
		}

		start(dir) {
			if(this.isAnimating){return}
			this.sprite.classList.add(this.name);
			this.isAnimating=true;
			this.update(dir);
		}

		stop() {
			this.sprite.classList.remove(this.name);
			this.isAnimating=false;
			// this.sprite.velocity = 5;
		}

		update(dir){
			//increase velocity each frame while animation is running
			// this.sprite.velocity += .03;
			// if(this.isAnimating){
			// 	if(this.sprite.x <= 0) {
			// 		this.sprite.x=0;
			// 	}
			// 	this.sprite.x += this.sprite.velocity*dir;
			// 	this.sprite.style.transform = "translate3d(" + this.sprite.x + "px," + this.sprite.y + "px,0px) scale(3)";
			// }
		}
    }
);
