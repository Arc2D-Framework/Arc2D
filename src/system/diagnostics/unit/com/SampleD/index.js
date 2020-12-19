namespace `system.diagnostics.unit.com` (
	class SampleD extends w3c.ui.WebComponent  {
        constructor(el){
            super(el)
        }
		async onConnected(){
            super.onConnected();
            this.addEventListener("click", e=>this.onClick(e))
        }

        onClick(e){
            console.log(this)
            alert(this.namespace)
        }
	}
)