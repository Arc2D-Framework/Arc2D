

namespace `display.worlds.aeiou` (
    @tag("menu-dialog");
    class Menu extends WebComponent {
        constructor(world, machine) {
            super();
            this.machine = machine;
            this.world   = world;
            this.music = new Audio("/resources/tunes/04_start5.wav");
            this.music_select = new Audio("/resources/tunes/09_select1.wav");
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
            this.addEventListener("click", e => this.onStartGame(), false, "#start-game");
            this.addEventListener("change", e => this.onToggleMusic(e), false, "#enable-music");
        }

        onToggleMusic(e){
            if(e.target.checked){
                this.music_select.play();
                // this.music.play()
            }
            this.world.settings.music = e.target.checked;
        }

        onStartGame(){
            this.dispatchEvent("startgame");
        }


        //------------------MACHINE--------------------
        async onStart() {
            this.world.appendChild(this)
            if(this.world.settings.music){this.music.play();}
            this.isStarted=true;  
            console.log(this.namespace + " Started")
        }

        onAwake(){
            this.style.display="block";
            console.log(this.namespace + " Awake")
        }

        onSleep(){
            this.style.display="none";
            console.log(this.namespace + " Sleeping")
        }
        onExit(){

        }
        // onEnd(){
        //     debugger;
        //     this.remove();
        //     console.warn(this.namespace + " Ended");
        //     this.onReset();
        //     this.machine.onResume();
        //     this.music.pause();
        // }

        onUpdate(){

        }
    }
);
