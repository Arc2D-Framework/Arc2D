import '/src/system/math/MathUUID.js';
import! 'display.worlds.aeiou.Machine';
import 'display.worlds.aeiou.Menu';
import 'display.worlds.aeiou.Level';
import! 'display.worlds.aeiou.ScoreKeeper';



namespace `display.worlds.aeiou` (
    @tag("aeiou-game");
    class Game extends World {
        constructor(element){
            super(element);
            this.settings = {
                music : false
            }
            var ns = display.worlds.aeiou;//shortcut
            this.machine = new ns.Machine;
            this.machine.push(new ns.Level(this, this.machine));
            this.machine.push(new ns.Menu( this, this.machine));
        }

        async onConnected() {
            await super.onConnected();
            var ns = display.worlds.aeiou;
        }

        onUpdate(time){
            this.machine.onUpdate();
        }
    }
);
