
@stylesheets(["/src/./index.css"]);
@tag("other-activity");
namespace('activities.OtherActivity', class extends w3c.ui.WebComponent {
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
