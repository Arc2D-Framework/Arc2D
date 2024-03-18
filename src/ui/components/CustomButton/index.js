
export default namespace `ui.components` (
    class CustomButton extends HTMLSpanElement.with(IHtmlComponent) {
        static is = "my-button";
        static extends = "span";

        constructor(el, options) {
            super()
            this.initialize();
            
        }

        async onConnected() {
			await super.onConnected();
            this.on("click", e=>this.onClick(e))
		}

        // hasOwnTemplate() { return true }
        
        onClick(e) {
            console.log("clicked",e)
        }

        inShadow() {
            return true
        }

    }
)