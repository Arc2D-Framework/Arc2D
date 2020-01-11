
namespace `activities` (
    @stylesheets(["/src/./index.css"]);
    class ContactActivity extends w3c.ui.WebComponent {
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

    }
);
