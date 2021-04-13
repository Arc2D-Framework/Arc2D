namespace `display.components` (
	class RippleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), "false", "button");
		}

		onClick(e){
			const button = e.target;//event.currentTarget;

			const circle = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = circle.style.height = `${diameter}px`;
			circle.style.left = `${e.src.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${e.src.clientY - button.offsetTop - radius}px`;
			circle.classList.add("ripple");

			const ripple = button.querySelector(".ripple");
			ripple && ripple.remove();

			button.appendChild(circle);
		}
	}
)