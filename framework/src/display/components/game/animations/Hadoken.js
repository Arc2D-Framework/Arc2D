import '/src/core/ui/game/animations/Animation.js';

namespace `core.ui.game.animations` (
    class Hadoken extends core.ui.game.animations.Animation {
        constructor(name, sprite){
        	super(name, sprite);
			this.sprite = sprite;
			this.name   = name;
		}

		start(dir) {
			if(this.isAnimating){return}
			this.sprite.classList.add(this.name);
			this.isAnimating=true;
		}

		async stop() {
			this.sprite.classList.remove(this.name);
			await wait(500);
			this.isAnimating=false;
		}

		async update(dir){
			if(Key.isDown(Key.A) && !this.isAnimating){
                this.start();
                await wait(500);
                this.stop()
            }
		}
    }
);
