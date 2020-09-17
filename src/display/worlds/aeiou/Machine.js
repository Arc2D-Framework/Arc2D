
namespace `display.worlds.aeiou` (
    class Machine extends Array {
        constructor() {
            super();
        }

        push(action){
            super.push(action)
            return action;
        }

        onPause(){
            this.paused=true;
        }

        onResume(){
            this.paused=false;
        }

        onUpdate(){
            for (var i = this.length - 1; i >= 0; i--) {
                var action = this[i];
                if(action){
                    if(this.paused){
                        action.onPause();
                    }
                    else{
                         action.onResume()
                        !action.isStarted && action.onStart()
                         action.onUpdate();
                         this.isBlocking = action.isBlocking||false;
                      if(this.isBlocking) break;

                        if(action.isFinished) {
                          action.onEnd( );
                          this.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
);
