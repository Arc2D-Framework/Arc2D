
import 'ui.components.MessageBarExtended';
import 'ui.components.Label';
// import 'ui.components.MessageBarExtendedChild';
import CustomButton from 'ui.components.CustomButton';


namespace `ui.screens` (
    class ShadowDomDemo extends Application {
        
        async onConnected() {
            await super.onConnected();
            // return;

            // debugger
            // application.subscribe("connected", e=> this.onComponentConnected(e), false)
            // document.addEventListener("loaded", e=> this.onComponentConnected(e), false)

            var div1 = document.querySelector("div#test1");
            var div2 = document.querySelector("div#test2");
            // var span = document.querySelector("span#test3");
            // await sleep(1000);
            // span && span.setAttribute("is", "my-button");

            div1 && new ui.components.MessageBarExtended(div1);
            div2 && new ui.components.MessageBarExtended(div2);
            
            
            // var messageBar3 = document.createElement("message-bar-extended");
            //     messageBar3.innerHTML = `<h3>Message Bar 3</h3>`;
            // document.body.appendChild(messageBar3);

            // var messageBar4 = new ui.components.MessageBarExtended;
            // await sleep (1000)
            // alert(messageBar4.querySelector("h3"))
                // messageBar4.innerHTML = `<h3>Message Bar 4</h3>`; 
                // document.body.appendChild(messageBar4);

            // var messageBar5 = new ui.components.MessageBarExtendedChild;
            // document.body.appendChild(messageBar5);
        }

        onComponentConnected(e) {
            console.log("onComponentConnected", e.detail.path)
        }

        onMessage(e){
            console.log("Message received",e);
        }
    }
);
