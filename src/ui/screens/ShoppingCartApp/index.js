import 'ui.components.food.Menu';
import 'ui.components.food.Product';
import 'ui.components.food.Cart';

namespace `ui.screens` (
    class ShoppingCartApp extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
