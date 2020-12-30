
namespace `display.worlds.fruits` (
    class UIMachine extends Array {
        constructor() {
            super();
        }

        onUpdate(){
            var state = this[0];
                state&&!state.isSleeping&&state.onUpdate();
        }

        onRender(){
            var state = this[0];
                state&&!state.isSleeping&&state.onRender();
        }

        push(state){
            state && !state.isStarted && state.onStart();
            state && state.onAwake() ;//&& (current.isSleeping=false)
            state.isSleeping=false
            // var current = this[0];
                // current&&current.onSleep();
            this.pop();
            this.unshift(state);
        }

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
                // current&&!current.isFinished&&current.onSleep()&&(current.isSleeping=true);
                // current&&current.isFinished&&current.onExit();

            this.shift();
            // current = this[0];
            // current&&current.onAwake();
        }
    }
);
