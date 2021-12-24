import '/src/system/lang/Thread.js';

namespace `ui.components` (
	class RippleButton extends WebComponent  {
		static get is(){
			return "ripple-button"
		}

		async onConnected(){
			await super.onConnected();
			//alert("connecting")
			this.thread = new system.lang.Thread(this.onCalculate)
			this.thread.addEventListener("message", e => this.onCalculated(e))
			this.on("click", e=>this.onClick(e), true, "button");
		}

		onAwake(){
			//alert("onAwake")
		}

		onSleep(){
			//alert("onSleep")
		}

		//worker
		onCalculate(e){
			//worker does some calculation
			var num = e.data+100;
			postMessage({value:num});//returns it back to thread
		}

		onCalculated (e) {
			console.log("received:", e.data);//thread receives calculated result
		}

		isComposable(){return true}

		async onClick(e){
			debugger;
			this.thread.postMessage(100);//send to worker
			const button = e.target;

			const circle = document.createElement("span");
			const diameter = Math.max(button.clientWidth, button.clientHeight);
			const radius = diameter / 2;

			circle.style.width = circle.style.height = `${diameter}px`;
			circle.style.left = `${e.src.clientX - button.offsetLeft - radius}px`;
			circle.style.top = `${e.src.clientY - button.offsetTop - radius}px`;
			circle.classList.add("ripple");

			const ripple = button.querySelector(".ripple");
			ripple && ripple.remove();

			this.append(circle,button);
		}



		async onDisconnected(){
			console.log("removed",this)
		}

		cssStyle(){
			return `
				:host button {border:1px solid red}
			`
		}
	}
)