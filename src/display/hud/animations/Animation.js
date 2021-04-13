
namespace `display.hud.animations` (
    class Animation {
        constructor(name, sprite){
			this.sprite = sprite;
			this.name   = name;
		}

		start(dir) {
			if(this.isAnimating){return}
			this.sprite.classList.add(this.name);
			this.isAnimating=true;
			// this.update();
		}

		stop() {
			this.sprite.classList.remove(this.name);
			this.isAnimating=false;
		}

		update(){
			
		}

		play(dir){
			dir = typeof dir == "number"? dir:1;
			this.start(dir);
			this.update(dir);
		}
    }
);

