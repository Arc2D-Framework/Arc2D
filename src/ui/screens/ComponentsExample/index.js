import 'ui.components.TearableCloth';
import 'ui.components.CustomModal';
import 'ui.components.GooeyNav';
import 'ui.components.ContextMenu';
import 'ui.components.CustomFooter';
import 'ui.components.ProductGrid';

namespace `ui.screens` (
    class ComponentsExample extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.contextmenu = this.querySelector("ui-components-context-menu");
            this.on('contextmenu', (e) => this.onContextMenu(e), false, ".contextmenu-container");
            // this.on("mousedown", e => this.onToggleMenu(e))
        }

        onContextMenu(e){
            this.contextmenu.show(e);
        }

        onToggleMenu(e){
            this.contextmenu.toggle(e);
        }

    }
);
