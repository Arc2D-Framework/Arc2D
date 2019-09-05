import {sample} from '/src/modules/test3.mjs';

@stylesheets(["/src/./index.css"]);
@tag("activity-sample");
namespace('activities.ActivityTest', class extends w3c.ui.WebComponent {
    constructor() {
        super();
        this.src = "/src/./index.html";
        sample("activities.ActivityTest loaded")
    }

    onConnected() {
        this.render();
        this.addEventListener("click", (e)=> this.onClick(e), false)
    }

    onClick (e){
        alert(e)
    }

    onEnableShadow() {
        return false;
    }
});
