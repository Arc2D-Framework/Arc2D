namespace `core.ui` (
	class NavBar extends w3c.ui.WebComponent  {

		async onConnected() {
			await super.onConnected();
			this.ul = this.querySelector("ul");
			this.lastActive = this.querySelector("li.current");
			this.on("click", (e) => this.updateNav(e),false, "ul li");
		}
		
		updateNav(e){
			if(this.lastActive){
				this.lastActive.classList.remove("current");
				e.target.classList.add("current");
				this.lastActive = e.target;
			}
		}
	}
)