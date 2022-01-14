namespace `ui.components.food` (
	class Cart extends Component  {
        async onConnected() {
            await super.onConnected();
            application.on("request:additem", e => this.onRequestToAdd(e), false);
            this.on("click", (e) => this.onRequestToRemove(e),false, ".cart-item > span");
            this.cartItemsContainer = this.querySelector(".cart-items");
            this.defaultCartText = this.querySelector(".cart-math p");
            this.items = [];
            this.cartBasket = [];
        }

        onRequestToAdd(e){
            var item = e.data.item;
            console.log(e.data.item);
            this.items.push(item);
            console.log("I now have these items", this.items);
            this.onClearDefaultText();
            this.onComputeCartItem(e);
            this.onCalculateSubTotal();
            this.onCalculateTax();
            this.onCalculateGrandTotal();
        }

        onComputeCartItem(e){
            const title = e.data.item.lastElementChild.getAttribute('data-title');
			const price = e.data.item.lastElementChild.getAttribute('data-price');
			const imgLink = e.data.item.firstElementChild.attributes[0].nodeValue;

            console.log({title}, "\n", {price}, "\n");

            const cartItem = `
				<li class="cart-item">
                    <span class="fa fa-minus-circle" aria-hidden="true" style="opacity:0;visibility: hidden;"></span>
					<img src="${imgLink}" alt="${title}">
					<div class="cart-item-dets">
						<p class="cart-item-heading">${title}</p>
						<p class="g-price">$${price}</p>
					</div>
				</li>
			`.toNode();

            this.cartItemsContainer.appendChild(cartItem);
            this.cartBasket.push(cartItem);
            console.log("this.cartBasket", this.cartBasket);

        }

        onClearDefaultText(){
            this.defaultCartText.classList.add("hide");
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

        onSubtractSubtotal(){

        }

        onCalculateTax(){
            this.tax = (this.subtotal * 0.07)
            this.querySelector("#tax").innerHTML = this.tax.toFixed(2);
        }

        onSubtractTax(){
            //TODO
        }

        onRequestToRemove(){
            this.cartItemsContainer.removeChild(this.cartBasket.pop());
            console.log("this.cartBasket", this.cartBasket);
            // this.onSubtractSubtotal();
        }
	}
)