namespace `ui.components` (
	class ContextMenu  extends WebComponent  {
		constructor(element){
            super(element);
        }

		async onConnected() {
            await super.onConnected();

			this.menu = this.querySelector('.menu');
			this.on('contextmenu', (e) => this.onContextMenu(e), false);
        }

		onContextMenu(e){
			e.preventDefault();
			this.showMenu(e.pageX, e.pageY);
			this.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
		}

		onMouseDown(e){
			this.hideMenu();
			this.removeEventListener('mousedown', () => this.onMouseDown(e),false);
		}

		showMenu(x, y){
			this.menu.style.left = x + 'px';
			this.menu.style.top = y + 'px';
			this.menu.classList.add('menu-show');
		}

		hideMenu(){
    		this.menu.classList.remove('menu-show');
		}
	}
)