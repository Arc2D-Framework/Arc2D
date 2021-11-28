namespace `system.input` (
    class KeyBoard {

        /* Direction key state */
        static get directions() {
            return {
               up: "up",
               down: "down",
               left: "left",
               right: "right",
               space: "space"
           }
        }
        static get keys() {
            return {
               38: this.directions.up,
               37: this.directions.left,
               39: this.directions.right,
               40: this.directions.down,
               32: this.directions.space
           }
        }

        static initialize(){
            this.held_directions = [];

            document.addEventListener("keydown", (e) => {
               var dir = this.keys[e.which];
               if (dir && this.held_directions.indexOf(dir) === -1) {
                  this.held_directions.unshift(dir)
               }
            })

            document.addEventListener("keyup", (e) => {
               var dir = this.keys[e.which];
               var index = this.held_directions.indexOf(dir);
               if (index > -1) {
                  this.held_directions.splice(index, 1)
               }
            });
        }
    }
);

system.input.KeyBoard.initialize();
KeyBoard = system.input.KeyBoard;