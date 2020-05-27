import '/src/core/ui/game/animations/Animation.js';

namespace `core.ui.game.animations` (
    class Shoryuken extends core.ui.game.animations.Animation {
        constructor(name, sprite){
            super(name, sprite);
            this.sprite = sprite;
            this.name   = name;
            this.floor = document.querySelector("#floor");
            this.floor_bounds = this.floor.getBoundingClientRect();

        }

        start() {
            if(this.isAnimating){return}
            this.isAnimating=true;
            this.sprite.y_velocity -= 10;
            this.sprite.isjumping = true;
            this.sprite.classList.add(this.name);
        }

        stop() {
            this.sprite.classList.remove(this.name);
            this.isAnimating=false;
            this.sprite.isjumping = false;
            this.sprite.y = 0;
            // this.sprite.y_velocity = 0;
        }

        update(){
            if(Key.isDown(Key.D)){
                this.floor_bounds = this.floor.getBoundingClientRect();
                
                this.start();
                this.jump()

            } else {
                this.jump()   
            }
        }

        jump(){
            if(!this.isAnimating){return}
            this.sprite_bounds  = this.sprite.getBoundingClientRect();
            var sprite_bottom   = this.sprite_bounds.y+this.sprite_bounds.height;
            // console.log("floor_bounds",this.floor_bounds.top,this.sprite_bounds.y+this.sprite_bounds.height)
            // console.log("y",this.sprite_bounds.y+this.sprite_bounds.height);
            if(sprite_bottom-40 >= this.floor_bounds.top) {
                this.stop()
            }
            else {
                this.sprite.y_velocity += 3.5;// gravity
                this.sprite.y += this.sprite.y_velocity;
                // this.sprite.y_velocity *= 1;// friction
            }
            this.sprite.style.transform = "translate3d(" + this.sprite.x + "px," + this.sprite.y + "px,0px) scale(3)";
        }
    }
);
