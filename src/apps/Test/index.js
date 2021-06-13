import {Label} from 'display.components.Label';

@tag("test-app");
namespace `apps` (
    class Test extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();

            

            for(var i=0; i<=1; i++){
                var l = new Label;

                await this.append(l);
            }
            
        }
    }
);
