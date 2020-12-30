import 'display.worlds.fruits.Splash';
import 'display.worlds.fruits.Level';
import! 'display.worlds.fruits.UIMachine';

@tag("fruit-bowl");
namespace `display.worlds.fruits` (
    class Game extends World {
        constructor(element){
            super(element);
            var ns          = display.worlds.fruits;//shortcut
            this.machine    = new ns.UIMachine;
            this.splash      = new ns.Splash(this, this.machine);
            // this.menu       = new ns.Menu(this, this.machine);
            // this.gameover   = new ns.GameOver(this, this.machine);
            this.machine.push(this.splash);
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
            this.level = this.level || new display.worlds.fruits.Level(this, this.machine);
            this.machine.push(this.level);
        }

        onUpdate=(time)=>{
            this.machine.onUpdate();
        }
    }
);
