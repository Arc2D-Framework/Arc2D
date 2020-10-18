
namespace `display.worlds.aeiou` (
    class UIMachine extends Array {
        constructor() {
            super();
        }

        onUpdate(){
            var state = this[0];
                state&&state.onUpdate();
        }

        onRender(){
            var state = this[0];
                state&&state.onRender();
        }

        push(state){
            state && !state.isStarted && state.onStart();
            state && state.onAwake();
            // var current = this[0];
                // current&&current.onSleep();
            this.pop();
            this.unshift(state);
        }

        pop(){
            var current = this[0];
                current&&!current.isFinished&&current.onSleep();
                current&&current.isFinished&&current.onExit();
            this.shift();
            // current = this[0];
            // current&&current.onAwake();
        }
    }
);
