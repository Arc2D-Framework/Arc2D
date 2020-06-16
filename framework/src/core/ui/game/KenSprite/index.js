import '/src/core/ui/game/Sprite/index.js';
import '/src/core/ui/game/animations/Animation.js';
import '/src/core/ui/game/animations/Walking.js';
import '/src/core/ui/game/animations/Kneeling.js';
import '/src/core/ui/game/animations/Jumping.js';
import '/src/core/ui/game/animations/Hadoken.js';
import '/src/core/ui/game/animations/Shoryuken.js';

namespace `core.ui.game` (
	@stylesheets(["src/./index.css"]);
    class KenSprite extends core.ui.game.Sprite {
        constructor (element){
            super(element);
            this.x=0;
            this.y=0;
            this.y_velocity=0;
            this.isjumping = false;

            this.stance = new core.ui.game.animations.Animation("stance", this);
            this.walk = new core.ui.game.animations.Walking("walk", this);
            this.kneel = new core.ui.game.animations.Kneeling("kneel", this);
            this.jump = new core.ui.game.animations.Jumping("jump", this);
            this.hadoken = new core.ui.game.animations.Hadoken("hadoken", this);
            this.shoryuken = new core.ui.game.animations.Shoryuken("shoryuken", this);
            // setTimeout(_=>console.log(this.getCollider()),1000)
        }

        getCollider(){
            // var coords=this.getBoundingClientRect();
            return {
                x:this.x,
                y:this.y,
                width : 210,
                height : 240,
                bottom:this.y+240
            }
        }

        canWalk(){
            return !this.kneel.isAnimating;
        }

        onDraw(){}

        onUpdate(delta){
            this.walk.update(delta);
            this.kneel.update(delta);
            this.jump.update(delta);
            this.hadoken.update(delta);
            this.shoryuken.update();
            /*if (Key.isDown(Key.RIGHT)) {
                Key.isDown(Key.DOWN) ? (
                    this.walk.stop(), 
                    this.kneel.start()
                ) : this.kneel.stop();

                !this.kneel.isAnimating && this.walk.play()
            } 
            else if (Key.isDown(Key.LEFT)) {
                Key.isDown(Key.DOWN) ? (
                    this.walk.stop(), 
                    this.kneel.start()
                ) : this.kneel.stop();

                !this.kneel.isAnimating && this.walk.play(-1)
            } else {
                this.walk.stop(); 
            }

            

            Key.isDown(Key.DOWN) ? (
                this.walk.stop(), 
                this.kneel.start()
            ) : this.kneel.stop();


            Key.isDown(Key.UP) ?
                this.jump.play():
                this.jump.update();


            if(Key.isDown(Key.A)){
                if(this.jump.isAnimating){return}
                this.hadoken.start();
                wait(500).then(_=> this.hadoken.stop())
            }

            if(Key.isDown(Key.D)){
                if(this.jump.isAnimating){return}
                if(this.shoryuken.fire){return}
                this.shoryuken.start()
            } 
            this.shoryuken.update();*/
        }

        stance(){
        	this.classList.add("stance")
        }

        onConnected(){
            super.onConnected();
            this.stance.start();
        }
    }
);
