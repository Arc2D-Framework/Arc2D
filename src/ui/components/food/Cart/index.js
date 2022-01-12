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
            this.onCalculateSubTotal();
            this.onCalculateTax();
            this.onCalculateGrandTotal();
        }

        onCalculateGrandTotal(){
            var grand = this.subtotal + this.tax
            this.querySelector("#grandtotal").innerHTML = grand.toFixed(2)
        }

        onCalculateSubTotal(){
            var subtotal = 0;
            for(let item of this.items){
                var price = item.querySelector(".g-price").textContent;
                    price = price.replace(/\$/g, ""); //remove $
                    price = parseFloat(price); //convert to a floating point number with decimals.
                    subtotal +=price;
            }
            this.subtotal = subtotal;
            this.querySelector("#subtotal").innerHTML = subtotal;
        }

        onCalculateTax(){
            this.tax = (this.subtotal * 0.07)
            this.querySelector("#tax").innerHTML = this.tax.toFixed(2);
        }

        onRequestToRemove(){
            //TODO
        }
	}
)