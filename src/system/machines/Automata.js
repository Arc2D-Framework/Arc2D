
namespace `system.machines` (
    class Automata extends Array {
        constructor() {
            super();
        }

        get state(){
            return this[0]
        }

        //called by game loop
        onUpdate(timestamp, delta){
            var state = this[0];
                //================AWAKE IF SLEEPING======
                state&&state.isSleeping&&state.onAwake();
                state&&(state.isSleeping=false);
                //========================================
                state&&!state.isSleeping&&state.onUpdate&&state.onUpdate(timestamp, delta);
        }

        //called by game loop
        onFixedUpdate(time){
            var state = this[0];
                state&&!state.isSleeping&&state.onFixedUpdate&&state.onFixedUpdate(time);
        }

        //called by game loop
        onDraw(interpolation){
            var state = this[0];
                state&&!state.isSleeping&&state.onDraw&&state.onDraw(interpolation);
        }

        

        //called by user to push in a new Component
        push(state){
            debugger;
            if(this[0]==state){return}
            this[0]&&this[0].onSleep();
            this[0]&&(this[0].isSleeping=true);
            state && !state.isStarted && state.onStart();
            state && state.onAwake();
            state.isSleeping=false
            // this.pop();
            this.unshift(state);
        }

        //called by machine
        pop(item){
            if(item){
                var current = this[0];
                if(current && current==item){
                    if(!current.isFinished){
                        current.onSleep()
                        current.isSleeping=true;
                    }
                    else {
                        current.onExit();
                        this[0]=null;
                    }
                    this.shift();
                    this[0].onAwake();
                    this[0].isSleeping=false;
                }
            } else {
                var s = this.shift();
                    s.onSleep();
                this[0] && this[0].onAwake()
                this[0].isSleeping=false;
            }   
            // this.shift();
        }
    }
);
