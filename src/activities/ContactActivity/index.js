
namespace `activities` (
    @stylesheets(["/src/./index.css"]);
    @cascade(true);
    class ContactActivity extends w3c.ui.WebComponent {
        constructor() {
            super();
            // this.src = "/src/./index.html";
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
    }
);
