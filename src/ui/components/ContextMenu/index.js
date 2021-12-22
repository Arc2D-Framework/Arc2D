namespace `ui.components` (
	class ContextMenu  extends WebComponent  {
		constructor(element){
            super(element);
			this.items = [
				{
					label: "About",
					icon : "fa-star",
					items : [
						{label:"Privacy"},
						{label:"Preferences"},
						{label: "Factory Reset"}
					]
				}
			]
        }

		async onConnected() {
            await super.onConnected();
			this.menuContainer = document.querySelector('.contextmenu-container');
			this.menuContainer.addEventListener("contextmenu", e=> this.show(e), false);
			// this.subMenuItems = Array.from(this.querySelectorAll('.menu-item.submenu ul .menu-item'));
			// this.subMenuItems.forEach((item) =>{
			// 	item.addEventListener("mousedown", (e) => this.hide(e), false);
			// });

			this.on("mousedown", e=> this.hide(e), true); // hide menu on any click, anywhere
			this.menu = this.querySelector('.menu');

        }

		inShadow(){
			return true
		}

		renderItems(items){
			return `
				<ul class="menu">
					${
						items.map(
							item => 
								`<li class="menu-item ${item.items ? 'submenu':''}">
									<button type="button" class="menu-btn">
										${item.icon? '<i class="fa ' + item.icon + '"></i>':''}
										<span class="menu-text">${item.label}</span>
									</button>
									${item.items ? this.renderItems(item.items):""}
								</li>`
							).join("")
					}
				</ul>`
		}

		show(e){
			e.preventDefault();
			this.menu.style.left = e.pageX + 'px';
			this.menu.style.top = e.pageY + 'px';
			this.menu.classList.add('menu-show');
			this.classList.add("visible");
		}

		hide(e){
			e.preventDefault();
    		this.menu.classList.remove('menu-show');
			this.classList.remove("visible")
		}

		// toggle(e){
		// 	e.preventDefault();
		// 	this.menu.classList.toggle('menu-show');
		// 	this.classList.toggle("visible")
		// }
	}
)