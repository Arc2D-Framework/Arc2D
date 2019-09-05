
@tag("error-screen");
namespace("applications.ErrorScreen", class extends w3c.ui.Application {
    constructor(element){
        super(element);
    } 

    onEnableShadow(){
    	return false
    }

    onConnected() {
        this.render();
    }
});

