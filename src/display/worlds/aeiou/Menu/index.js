
namespace `display.worlds.aeiou` (
    @tag("menu-dialog");
    class Menu extends WebComponent {
        constructor(world, machine) {
            super();
            this.machine = machine;
            this.world   = world;
            this.music = new Audio("/src/resources/tunes/04_start5.wav");
            this.music_select = new Audio("/src/resources/tunes/09_select1.wav");
            this.music.loop=false;
            this.music.load();
            this.music_select.loop=false;
            this.music_select.load();
            this.onReset();
        }

        onReset(){
            this.isFinished = false;
            this.isBlocking = true;
            this.isStarted  = false;
        }

        async onConnected() {
            await super.onConnected(this.world.settings);
            this.addEventListener("click", e => this.onExit(), false, "#start-game");
            this.addEventListener("change", e => this.onToggleMusic(e), false, "#enable-music");
        }

        onToggleMusic(e){
            if(e.target.checked){
                this.music_select.play();
            }
            this.world.settings.music = e.target.checked;
        }

        async onStart() {
            this.world.appendChild(this);
            if(this.world.settings.music){this.music.play();}
            this.isStarted=true;  
            this.machine.onPause(); 
            console.log(this.namespace + " Started")
        }
 
        onExit(){
            this.isFinished = true;
            this.isBlocking = false;
            this.machine.onResume();
            this.music.pause();
        }

        onPause() {this.paused=true;}

        onResume(){this.paused=false;}


        onEnd(){
            this.remove();
            console.warn(this.namespace + " Ended");
            this.onReset();
            this.machine.onResume();
            this.music.pause();
        }

        onUpdate(){}
    }
);
