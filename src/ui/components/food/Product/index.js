namespace `ui.components.food` (
	class Product extends WebComponent  {
		async onConnected(){
			await super.onConnected();
			this.on("click", e => this.onAddToCart(e), false , '.add-button');
			this.on("click", e => this.onRemoveFromCart(e), false , '.remove-button');
		}

		onAddToCart(e){
			var item = this.cloneNode(true);
			this.dispatchEvent("request:additem", {item})
		}

		onRemoveFromCart(e){
			var item = this;
			this.dispatchEvent("request:removeitem", {item})
		}

		get price(){
			return parseFloat(this.getAttribute("price"))
		}
	}
)