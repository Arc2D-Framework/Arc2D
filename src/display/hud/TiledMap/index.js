
import '@system.renderers.html.Topdown';
import  'display.hud.Max';
import  'display.hud.Npc';
// import  'experiments.tiled.sprites.Npc';
import '@system.machines.DepthSort';
import '@system.machines.Collider';
// import! 'experiments.tiled.input.Keyboard';

import '@system.machines.Camera';
import '@system.input.Keyboard';
import '@domain.maps.TiledMap';
let {DepthSort,Collider,Camera} = system.machines;
let {Max,Npc} = display.hud;

namespace `display.hud` (
    class TiledMap extends WebComponent {
        constructor(world, machine){
            super();
            this.machine = machine;
            this.world = this;
            this.onReset();
        }

        onReset(){
            this.isFinished = false;
            this.isStarted  = false;
        }

        async onConnected(){
            await super.onConnected();

            this.map = await new domain.maps.TiledMap("/resources/maps/topdown/topdown.json").load();
            application.map =this.map;
            this.hero = new Max;
            this.npc = new Npc;
            window.npc=this.npc;//debugging
            this.map.objects.push(this.hero);
            this.map.objects.push(this.npc);
            

            this.renderer   = new system.renderers.html.Topdown(this.world, this.map);
            this.depth      = new DepthSort(this.map.objects);
            this.collider   = new Collider(this.hero,this.map.objects);
            this.camera     = new Camera(this.world,2);

            this.ready = true;
        }

        //------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            this.style.display="block";
            console.log(this.namespace + " Awake");
            // this.music.play();
        }

        //Machine puts it to sleep.Usually hide itself, pause music, animate out.
        onSleep(){
            this.style.display="none";
            console.log(this.namespace + " Sleeping");
            // this.music.pause();
        }

        //Machine calls it once if never started, hence tthe isStarted flag. Usually,
        //you append this component to DOM, which fires onConnected() above.
        onStart() {
            // this.world.settings.music && this.music.play();
            application.appendChild(this)
            // this.world.appendChild(this)
            this.isStarted=true;   
            console.log(this.namespace + " Started");
        }


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            this.remove();
            console.log(this.namespace + " Exit")
            // this.music.pause();
            // this.remove();
            // this.style.display="none";
            // this.world.removeEventListener("gameover", this.onGameOver, false);
            // console.warn(this.namespace + " Ended");
            // this.onReset();
            // this.music.pause();
        }

        onFixedUpdate=(time)=>{
            if(this.ready){
                this.collider.onFixedUpdate(time);
                this.npc.onFixedUpdate(time);
            }
        }

        onUpdate=(timestamp, delta)=>{
            if(this.ready){
                this.hero.onUpdate(timestamp, delta);
                this.npc.onUpdate(timestamp, delta);
                this.camera && this.camera.lookAt(this.hero)
            }
        }

        onDraw=(interpolation)=>{
            if(this.ready){
                this.camera && this.camera.onDraw(interpolation);
                this.depth.onDraw(interpolation);
                this.renderer.onDraw(interpolation);
                this.hero.onDraw(interpolation);
                this.npc.onDraw(interpolation);
            }
        }

        onUpdateEnd = (fps, panic) => {
            super.onUpdateEnd(fps, panic);
            if(this.fpsCounter){
                this.fpsCounter.textContent = Math.round(fps) + ' FPS';
            }
        }
        onShowFPS = (e) => {
            this.fpsValue.textContent = Math.round(e.target.value);
        }

        onUpdateFPS = (e) => {
            var val = parseInt(e.target.value, 10);
            MainLoop.setMaxAllowedFPS(val === 60 ? Infinity : val);
        }
        

        setupFPSCounter(){
            this.fpsCounter = this.querySelector('#fpscounter');
            this.fpsValue = this.querySelector('#fpsvalue');
            this.fps = this.querySelector('#fps');

            // Update the slider value label while the slider is being dragged.
            this.fps.addEventListener('input',  this.onShowFPS);
            this.fps.addEventListener('change', this.onUpdateFPS);
        }
    }   
);
