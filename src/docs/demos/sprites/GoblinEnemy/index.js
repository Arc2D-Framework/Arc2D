import 'core.ui.game.Sprite';
import 'core.ui.game.animations.Animation';

namespace `docs.demos.sprites` (
	class GoblinEnemy  extends core.ui.game.Sprite  {
		constructor(){
            super();
            this.stance = new core.ui.game.animations.Animation("stance", this);
        }

        onDraw() {

        }

        onUpdate(delta) {
            
        }

        onConnected(){
            super.onConnected();
            this.stance.start();
        }
	}
)