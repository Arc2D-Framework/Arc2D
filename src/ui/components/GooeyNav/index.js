namespace `ui.components` (
	class GooeyNav extends WebComponent  {
		constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.effect     = this.getAttribute("effect")||"scatter";
            this.container  = this.querySelector( 'nav' );
            this.circles    = this.container.querySelectorAll( '.menu-item' )
            this.on("click", e => this.onToggle(e), false, "label");
            this.on("click", e => this.onMenuClicked(e), false, ".menu-item")
        }

        async onMenuClicked(e){
            e.preventDefault();
            e.stopPropagation();
            console.log("CLICKED:", e.target);
            await sleep(150);
            this.onToggle(e);
        }
        
        onToggle(e){
            this.is_open = !this.is_open; //toggle true|false;
            this.is_open ?
                (this.open(),  this.classList.add("opened")): 
                (this.close(), this.classList.remove("opened"));
        }

        open() {
            let angle  = 0;
            let dangle = 360 / this.circles.length;
            this.circles.forEach(circle => {
                angle += dangle
                circle.style.transform = `
                        rotate(${angle}deg) 
                        translate3d(${this.container.clientWidth / 2}px, 0px, 0px)
                        rotate(-${angle}deg)
                    `
            });
        }

        close() {
            this.circles.forEach(circle => {
                this.effect == "spiral" ?
                    (circle.style.transform = `rotate(0deg) translate3d(0px, 0px, 0px)`): //spiral
                    (circle.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg)`); //scatter
            });
        }
	}
)