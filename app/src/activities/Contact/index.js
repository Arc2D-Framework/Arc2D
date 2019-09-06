
@stylesheets(["/src/./index.css"]);
@tag("activity-contact");
namespace('activities.Contact', class extends w3c.ui.WebComponent {
    constructor() {
        super();
        this.src = "/src/./index.html";
    }

    onConnected() {
        this.render();
    }

    onEnableShadow() {
        return false
    }

    template(){
        return `
            <template>
                <div>test</div>
            </template>
        `
    }
});
