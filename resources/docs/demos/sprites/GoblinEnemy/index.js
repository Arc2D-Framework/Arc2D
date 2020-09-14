import 'docs.demos.game.Sprite';
import! 'docs.demos.game.animations.Animation';

namespace `docs.demos.sprites` (
	class GoblinEnemy extends docs.demos.game.Sprite  {
		constructor(){
            super();
            this.stance = new docs.demos.game.animations.Animation("stance", this);
        }

        onLoadInstanceStylesheet(){return true}

        onDraw() {

        }

        onUpdate(delta) {
            
        }

        async onConnected(){
            await super.onConnected();
            this.stance.start();
        }
	}
)