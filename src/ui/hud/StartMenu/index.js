import 'ui.components.CoverFlow';

namespace `ui.hud` (
    class StartMenu extends WebComponent {
        constructor(world, machine) {
            super();
            this.machine = machine;
            this.world   = world;
            this.music = new Audio("/resources/sfx/04_start5.wav");
            this.music_select = new Audio("/resources/sfx/Rolemusic_-_the_river.mp3");
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
            await super.onConnected();
            this.on("click",  e => this.onStartGame(),      false, "#start-game");
        }

        onStartGame(){
            this.dispatchEvent("startgame", {});
        }
        
        


        //------------------MACHINE METHODS--------------------
        async onStart() {
            // debugger;
            application.appendChild(this)
            // if(this.world.settings.music){this.music.play();}
            this.isStarted=true;  
            console.log(this.namespace + " Started")
        }

        async onAwake(){
            // debugger;
            this.style.display="block";
            await wait(200)
            this.classList.add("awake")
            console.log(this.namespace + " Awake")
        }

        onSleep(){
            // debugger;
            this.style.display="none";
            this.classList.remove("awake")
            console.log(this.namespace + " Sleeping")
        }
        
        onExit(){
            // debugger;
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
            // debugger;
        }
    }
);
