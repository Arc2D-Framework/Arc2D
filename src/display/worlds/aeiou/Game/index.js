import '/src/system/math/MathUUID.js';
import! 'display.worlds.aeiou.Machine';
import! 'display.worlds.aeiou.UIMachine';
import 'display.worlds.aeiou.Menu';
import 'display.worlds.aeiou.Level';
import 'display.worlds.aeiou.GameOver';
import! 'display.worlds.aeiou.ScoreKeeper';



namespace `display.worlds.aeiou` (
    @tag("aeiou-game");
    class Game extends World {
        constructor(element){
            super(element);
            this.settings = {
                music : false
            }
            var ns          = display.worlds.aeiou;//shortcut
            this.machine    = new ns.UIMachine;
            this.level      = new ns.Level(this, this.machine);
            this.menu       = new ns.Menu(this, this.machine);
            this.gameover   = new ns.GameOver(this, this.machine);
            this.machine.push(this.menu);
        }

        async onConnected() {
            await super.onConnected();
            this.addEventListener("startgame",  e => this.onStartGame(e))
            this.addEventListener("pausegame",  e => this.onPauseGame(e))
            this.addEventListener("gameover",   e => this.onGameOver(e))
        }

        onGameOver(){
            this.machine.push(this.gameover);
            this.level=null
        }

        onPauseGame(){
            this.machine.push(this.menu);
        }

        onStartGame(){
            this.level = this.level || new display.worlds.aeiou.Level(this, this.machine);
            this.machine.push(this.level);
        }

        onUpdate=(time)=>{
            this.machine.onUpdate();
        }
    }
);
