import! 'docs.demos.game.animations.Animation';

namespace `docs.demos.game.animations` (
    class Walking extends core.ui.game.animations.Animation {
        constructor(name, sprite){
        	super(name, sprite);
			this.sprite = sprite;
			this.name   = name;
			this.sprite.velocity = 1;
			this.sprite.x = 0;
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
			this.sprite.velocity = 5;
		}

		update(delta){
			//dir=1;
			if (Key.isDown(Key.RIGHT) && this.sprite.canWalk()) {
				this.dir=1;
				this.start()
				this.isAnimating=true;
				this.walk(delta)
			} 
			else if (Key.isDown(Key.LEFT) && this.sprite.canWalk()) {
				this.dir=-1;
				this.start()
				this.isAnimating=true;
				this.walk(delta)
			}
			else {
				this.stop()
			}
		}

		walk(delta=16.6){
			//increase velocity each frame while animation is running
			this.sprite.velocity += .0001 * delta;
			if(this.isAnimating){
				if(this.sprite.x <= 0) {
					this.sprite.x=0;
				}
				this.sprite.x += this.sprite.velocity*this.dir;
				this.sprite.style.transform = "translate3d(" + this.sprite.x + "px," + this.sprite.y + "px,0px) scale(3)";
			}
		}
    }
);
