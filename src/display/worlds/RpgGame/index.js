import '@system.machines.UIMachine';
import 'display.hud.StartMenu';
import 'display.hud.TiledMap';
let {UIMachine} = system.machines;
let {StartMenu,TiledMap} = display.hud;

namespace `display.worlds` (
    class RpgGame extends World {
        constructor(element){
            super(element);
            this.machine    = new UIMachine;
            this.startmenu  = new StartMenu(this, this.machine);
            this.map        = new TiledMap(this, this.machine);
        }

        async onConnected() {
            await super.onConnected();
            this.machine.push(this.startmenu);
            application.addEventListener("startgame", e=>this.onStart(), false)
        }

        onStart(){
            this.machine.push(this.map);
        }

        //onFixedUpdate, runs many times per frame. Good place for physics/collision/ai
        onFixedUpdate = (time) => {
            this.machine.onFixedUpdate(time);
        }
        

        //onDraw, runs 1x per frame. Good place to paint
        onDraw = (interpolation) => {
            this.machine.onDraw(interpolation);
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
        onUpdate = (timestamp, delta) => {
            this.machine.onUpdate(timestamp, delta);
            // if(Key.isDown(Key.ESC)){
            //     this.onPauseGame();
            // }
        }
    }
);
