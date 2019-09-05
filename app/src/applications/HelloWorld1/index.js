import "/src/core/ui/CoverFlow/index.js";


@tag("application-view");
namespace("applications.HelloWorld1", class extends w3c.ui.Application {
    constructor(element){
        super(element);
    }

    template(){
        return null
    }

    onEnableShadow(){
        return false
    }

    onConnected() {
        this.render();
    }
})
