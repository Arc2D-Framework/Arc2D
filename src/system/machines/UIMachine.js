
namespace `system.machines` (
    class UIMachine extends Array {
        constructor() {
            super();
        }

        //called by game loop
        onUpdate(timestamp, delta){
            var state = this[0];
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
            if(this[0]==state){return}
            state && !state.isStarted && state.onStart();
            state && state.onAwake();
            state.isSleeping=false
            this.pop();
            this.unshift(state);
        }

        //called by machine
        pop(){
            var current = this[0];
            if(current){
                if(!current.isFinished){
                    current.onSleep()
                    current.isSleeping=true;
                }
                else {
                    current.onExit();
                    this[0]=null;
                }
            }
            this.shift();
        }
    }
);
