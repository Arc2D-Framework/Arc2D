import '@ui.states.Off';
var {Off} = ui.states;

namespace `ui.components` (
	class Switch extends Component2D  {

		async onConnected(){
			await super.onConnected();
			this.button = this.querySelector("button");
			this.behaviors.push(new Off(this));
			// this.addEventListener("click", e => this.onToggle(e), true, "button");
			this.addEventListener("click", e => this.behaviors.onUpdate(e), true, "button");
		}

		// onToggle(e){
		// 	if(e.target.classList.contains("on")){
		// 		debugger;
		// 		e.target.classList.remove("on");
		// 		e.target.classList.add("off");
		// 		this.value=0;
		// 		this.dispatchEvent("off")
		// 	}
		// 	else if(e.target.classList.contains("off")){
		// 		debugger;
		// 		e.target.classList.remove("off");
		// 		e.target.classList.add("on");
		// 		this.value=1;
		// 		this.dispatchEvent("on")
		// 	}
		// 	else {
		// 		debugger;
		// 		e.target.classList.add("on")
		// 		this.value=1;
		// 		this.dispatchEvent("on")
		// 	}
		// }
	}
)