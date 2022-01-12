namespace `ui.components` (
	class ShoppingCart extends WebComponent  {
		constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();

			this.subtotal = 0;
			this.cartItemContainer = this.querySelector("ul.cart-items");
			this.cartMathContainer = this.querySelector(".cart-math");

			this.on("click", (e) => this.addToCart(e), false , '.add-button');
        }

		calculateTax(subtotal) {
			const tax = subtotal * 0.13;
			const formattedTax = tax.toFixed(2);
			return formattedTax;
		}

		calculateTotal(subtotal) {
			const tax = this.calculateTax(subtotal);
			const total = parseFloat(subtotal) + parseFloat(tax);
			const formattedTotal = total.toFixed(2);
			return formattedTotal;
		}

		addToCart(e){
			this.cartMathContainer.innerHTML = "";
			const title = e.target.getAttribute('data-title');
			const price = e.target.getAttribute('data-price');
			const imgLink = this.getImgLink(title);
			console.log({title}, "\n", {price}, "\n");

			const item = `
				<li class="cart-item">
					<img src="${imgLink}" alt="${title}">
					<div class="cart-item-dets">
						<p class="cart-item-heading">${title}</p>
						<p class="g-price">$${price}</p>
					</div>
				</li>
			`.toNode();
			this.cartItemContainer.appendChild(item);
			
			
			this.subtotal = this.subtotal + price;
			
			this.formattedSubtotal = this.subtotal.toFixed(2);
			this.tax = this.calculateTax(this.subtotal);
			this.total = this.calculateTotal(this.subtotal);

			const calculatedBlockEl = `
				<p class="cart-math-item">
					<span class="cart-math-header">Subtotal:</span>
					<span class="g-price subtotal">$${this.formattedSubtotal}</span>
				</p>
				<p class="cart-math-item">
					<span class="cart-math-header">Tax:</span>
					<span class="g-price tax">$${this.tax}</span>
				</p>
				<p class="cart-math-item">
					<span class="cart-math-header">Total:</span>
					<span class="g-price total">$${this.total}</span>
				</p>
			`.toNode();
			this.cartMathContainer.appendChild(calculatedBlockEl);
			// $('.cart-math').html(`
			// 	<p class="cart-math-item">
			// 	<span class="cart-math-header">Subtotal:</span>
			// 	<span class="g-price subtotal">$${formattedSubtotal}</span>
			// 	</p>
			// 	<p class="cart-math-item">
			// 	<span class="cart-math-header">Tax:</span>
			// 	<span class="g-price tax">$${tax}</span>
			// 	</p>
			// 	<p class="cart-math-item">
			// 	<span class="cart-math-header">Total:</span>
			// 	<span class="g-price total">$${total}</span>
			// 	</p>
			// `);
		}

		getImgLink = title => {
			let imgLink;
			switch (title) {
			  case 'French Fies with Ketchup':
				imgLink = '../../../../resources/img/plate__french-fries.webp';
				break;
			  case 'Salmon and Vegetables':
				imgLink = '../../../../resources/img/plate__salmon-vegetables.webp';
				break;
			  case 'Spaghetti with Sauce':
				imgLink = '../../../../resources/img/plate__spaghetti-meat-sauce.webp';
				break;
			  case 'Tortellini':
				imgLink = '../../../../resources/img/plate__tortellini.webp';
				break;
			  case 'Chicken Salad':
				imgLink = '../../../../resources/img/plate__chicken-salad.webp';
				break;
			  default:
				imgLink = undefined;
			}
		
			return imgLink;
		}
	}
)