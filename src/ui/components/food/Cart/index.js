namespace `ui.components.food` (
	class Cart extends Component  {
        async onConnected() {
            await super.onConnected();
            application.on("request:additem", e => this.onRequestToAdd(e), false);
            this.on("click", (e) => this.onRequestToRemove(e),false, ".cart-item > span");
            this.cartItemsContainer = this.querySelector(".cart-items");
            this.defaultCartText = this.querySelector(".cart-math p");
            this.items = [];
        }

        onRequestToAdd(e){
            this._wasItemAdded = true;
            var item = e.data.item;
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
            const product_id = e.data.item.id;
			const price = e.data.item.lastElementChild.getAttribute('data-price');
			const imgLink = e.data.item.firstElementChild.attributes[0].nodeValue;
            const cartItem = `
				<li id="${product_id}" class="cart-item">
                    <span class="fa fa-minus-circle" aria-hidden="true" style="opacity:0;visibility: hidden;"></span>
					<img src="${imgLink}" alt="${title}">
					<div class="cart-item-dets">
						<p class="cart-item-heading">${title}</p>
						<p class="g-price">$${price}</p>
					</div>
				</li>
			`.toNode();

            this.cartItemsContainer.appendChild(cartItem);
            // console.log(this.items)
            // this.cartBasket.push(cartItem);

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
            this.tax = (this.subtotal * 0.07);
            // this.tax = (this.subtotal * 0.07);
            console.log("THIS.TAX",this.tax.toFixed(2))
            this.querySelector("#tax").innerHTML = this.tax.toFixed(2);
        }

        onCalculateGrandTotal(){
            var grandtotal = this.subtotal + this.tax;
            this.querySelector("#grandtotal").innerHTML = grandtotal.toFixed(2)
        }

        onRequestToRemove(e){
            console.log("this.items BEFORE REMOVE", this.items);
            const productNode = e.matchedTarget.parentNode;
            const filteredItem = this.items.filter(p =>{
                return p == productNode;
            })
            
            // this.onSubtractTax(e)
            // this.onSubtractSubtotal(e);
            this.onCalculateSubTotal();
            this.onCalculateTax();
            this.onCalculateGrandTotal();

            this.items.splice(filteredItem,1);
            this.cartItemsContainer.removeChild(productNode);

            console.log("this.items AFTER REMOVE", this.items);
        }

        onClearDefaultText(){
            this.defaultCartText.classList.add("hide");
        }
	}
)