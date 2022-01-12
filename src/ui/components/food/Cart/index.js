namespace `ui.components.food` (
	class Cart extends Component  {
        async onConnected() {
            await super.onConnected();
            application.on("request:additem", e => this.onRequestToAdd(e), false)
            this.items = [];
        }

        onRequestToAdd(e){
            var item = e.data.item;
            this.items.push(item);
            console.log("I now have these items", this.items);
            this.onCalculate();
        }

        onCalculate(){
            var subtotal = 0;
            for(let item of this.items){
                var price = item.querySelector(".g-price").textContent;
                    price = price.replace(/\$/g, ""); //remove $
                    price = parseFloat(price); //convert to a floating point number with decimals.
                    subtotal +=price;
            }
            alert(subtotal)
        }

        onRequestToRemove(){
            //TODO
        }
	}
)