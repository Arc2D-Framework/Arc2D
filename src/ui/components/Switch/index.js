import '@system.machines.Automata';
import '@ui.states.Off';
import '@ui.states.On';


namespace `ui.components` (
	class Switch extends WebComponent  {
		constructor(){
			super();
			this.machine = new system.machines.Automata;
			
		}

		async onConnected(){
			await super.onConnected();
			window.b=this;
			this.button = this.querySelector("button");
			this.machine.push(new ui.states.Off(this,this.machine));
			// this.addEventListener("click", e => this.onToggle(e), true, "button");
			this.addEventListener("click", e => this.machine.onUpdate(e), true, "button");
			// this.addEventListener("mousedown", e => this.machine.onUpdate(e), true, "button");
			// this.addEventListener("mouseup", e => this.machine.onUpdate(e), true, "button");
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