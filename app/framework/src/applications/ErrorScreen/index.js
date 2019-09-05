
@tag("error-screen");
namespace("applications.ErrorScreen", class extends w3c.ui.Application {
    constructor(element){
        super(element);
        Session.Interceptor.enable();
    } 
});

