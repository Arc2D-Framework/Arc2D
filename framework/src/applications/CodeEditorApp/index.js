import 'core.views.ScreenEditor';
import '/framework/src/core/drivers/templating/Nunjucks/nunjucks-driver.js';

namespace `applications` (
    class CodeEditorApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
