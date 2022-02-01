import 'ui.components.food.Menu';
import 'ui.components.food.Product';
import 'ui.components.food.Cart';
import '@domain.collections.Foods';

namespace `ui.screens` (
    class ShoppingCartApp extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            await domain.collections.Foods.seed();

            this.menu = this.querySelector("ui-components-food-menu");
            this.cart = this.querySelector("ui-components-food-cart");
        }
    }
);
