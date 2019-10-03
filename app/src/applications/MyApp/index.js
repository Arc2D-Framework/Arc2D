import '/framework/src/core/http/Router.js';
// import '/framework/node_modules/od-rison/rison.js';
import '/src/core/ui/SampleX/index.js';

@tag("application-view");
namespace("applications.MyApp", class extends w3c.ui.Application {
    constructor(element){
        super(element);
        this.router = new core.http.Router(this,window);
    }

    onDisplayActivity(c){
        var slot = this.querySelector('div[slot="screen"]');
        slot.innerHTML="";
        slot.appendChild(c);
    }

    onEnableShadow(){
        return false
    }

    onConnected() {
        this.render();
    }
})
