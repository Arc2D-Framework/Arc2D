namespace `ui.components.food` (
	class Cart extends Component  {
        async onConnected() {
            await super.onConnected();
            application.on("request:additem", e => this.onRequestToAdd(e), false);
            application.on("request:removeitem", e => this.onRequestToRemove(e), false);
            this.cartItemsContainer = this.querySelector(".cart-items");
            this.items = [];
        }

        onRequestToAdd(e){
            var item = e.data.item;
            this.items.push(item);
            this.cartItemsContainer.appendChild(item);

            this.onCalculateSubTotal();
            this.onCalculateTax();
            this.onCalculateGrandTotal();
        }

        onRequestToRemove(e){
            var item = e.data.item;
            var index=-1;
            var cartitem=null;
            for(var i=0; i<=this.items.length-1; i++){
                if(this.items[i].id == item.id){
                    index=i;
                    cartitem=this.items[i]
                    break
                }
            }
            
            if(cartitem){
                this.items.splice(index,1);//need index to start from
                cartitem.remove();
                this.onCalculateSubTotal();
                this.onCalculateTax();
                this.onCalculateGrandTotal();
            }
            else {
                alert("cannot find item in cart")
            }
        }


        onCalculateSubTotal(){
            var subtotal = 0;
            for(let item of this.items){
                subtotal += item.price; //getter
            }
            this.subtotal = subtotal;
            this.querySelector("#subtotal").innerHTML = subtotal;
        }

        onCalculateTax(){
            this.tax = (this.subtotal * 0.07);
            console.log("THIS.TAX",this.tax.toFixed(2))
            this.querySelector("#tax").innerHTML = this.tax.toFixed(2);
        }

        onCalculateGrandTotal(){
            var grandtotal = this.subtotal + this.tax;
            this.querySelector("#grandtotal").innerHTML = grandtotal.toFixed(2)
        }
	}
)