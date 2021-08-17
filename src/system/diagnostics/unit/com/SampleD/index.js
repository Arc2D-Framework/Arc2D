namespace `system.diagnostics.unit.com` (
	class SampleD extends WebComponent  {
        constructor(el){
            super(el)
        }
		async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e=>this.onClick(e))
        }

        onClick(e){
            console.log(this)
            alert(this.namespace)
        }
	}
)