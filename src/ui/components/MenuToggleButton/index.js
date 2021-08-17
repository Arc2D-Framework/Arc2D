namespace `ui.components` (
	class MenuToggleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, ".nav-icon");
		}

		onClick(e){
			e.target.classList.toggle("active")
		}
	}
)